
//-----------------
// Audio Functions
//-----------------

audio.findSync = function(n) {
    var first = 0,
        current = 0,
        offset = 0;

    // Find the audio source with the earliest startTime to sync all others to
    for (var i in audio.source_loop) {
        current = audio.source_loop[i]._startTime;
        if (current > 0) {
            if (current < first || first === 0) {
                first = current;
            }
        }
    }

    // if (audio.context.currentTime > first) {
        offset = (audio.context.currentTime - first) % audio.buffer[n].duration;
    // }

    return offset;
};

audio.play = function(n) {
    if (audio.source_loop[n]._playing) {
        audio.stop(n);
    } else {
        audio.source_loop[n] = audio.context.createBufferSource();
        audio.source_loop[n].buffer = audio.buffer[n];
        audio.source_loop[n].loop = true;
        audio.source_loop[n].connect(audio.context.destination);

        // var offset = audio.findSync(n);
        audio.source_loop[n]._startTime = audio.context.currentTime;

        if (audio.compatibility.start === 'noteOn') {
            /*
            The depreciated noteOn() function does not support offsets.
            Compensate by using noteGrainOn() with an offset to play once and then schedule a noteOn() call to loop after that.
            */
            audio.source_once[n] = audio.context.createBufferSource();
            audio.source_once[n].buffer = audio.buffer[n];
            audio.source_once[n].connect(audio.context.destination);
            audio.source_once[n].noteGrainOn(0, offset, audio.buffer[n].duration); // currentTime, offset, duration
            /*
            Note about the third parameter of noteGrainOn().
            If your sound is 10 seconds long, your offset 5 and duration 5 then you'll get what you expect.
            If your sound is 10 seconds long, your offset 5 and duration 10 then the sound will play from the start instead of the offset.
            */

            // Now queue up our looping sound to start immediatly after the source_once audio plays.
            // TODO: fade in
            audio.source_loop[n][audio.compatibility.start](audio.context.currentTime + (audio.buffer[n].duration));
        } else {
            audio.source_loop[n][audio.compatibility.start](0);
        }

        audio.timers[n] = setInterval(function() {
            audio.moveDial(n)
        })

        audio.source_loop[n]._playing = true;

        audio.toggleButtonCSS(n)
    }
};

audio.stop = function(n) {
    if (audio.source_loop[n]._playing) {
        audio.source_loop[n][audio.compatibility.stop](0); // TODO: fade out
        audio.source_loop[n]._playing = false;
        audio.source_loop[n]._startTime = 0;
        if (audio.compatibility.start === 'noteOn') {
            audio.source_once[n][audio.compatibility.stop](0);
        }
    }

    clearInterval(audio.timers[n])

    // set its dial to 0
    audio.setDialValue(n,0)

    audio.toggleButtonCSS(n)

};


audio.moveDial = function(n) {
    if (audio.source_loop[n]._playing) {
        audio.setDialValue(n, 
            map_range(
                audio.findSync(n),
                0, audio.buffer[n].duration, 
                0, 1000)
        )
    }
}

audio.setDialValue = function (n, value) {

    $('#'+n)
            .val(value)
            .trigger('change')

}

audio.toggleButtonCSS = function (n) {

    // if it's playing, set it to have a pause button on hover
    if (audio.source_loop[n]._playing) {
        // the buttons parent div's 1st child is the canvas
        var canvas = $('#'+n)
            .parent()
            .children('canvas')

        canvas.hover(function() {
            canvas.css({"background": "url('static/css/img/blk_pause.png')",
                    "background-size": "64px",
                    "background-position": "5px 5px"})
            },
            function() {
                canvas.css({"background": "none"})
            })
    }

    else {
        var canvas = $('#'+n)
            .parent()
            .children('canvas')

        canvas.hover(function() {
            canvas.css({"background": "url('static/css/img/blk_play.png')",
                    "background-size": "64px",
                    "background-position": "5px 5px"})
            },
            function() {
                canvas.css({"background": "none"})
            })
    }
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//-----------------------------
// Check Web Audio API Support
//-----------------------------
try {
    // More info at http://caniuse.com/#feat=audio-api
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audio.context = new window.AudioContext();
} catch(e) {
    audio.proceed = false;
    alert('Web Audio API not supported in this browser.');
}

if (audio.proceed) {

    //---------------
    // Compatibility
    //---------------
    (function() {
        var start = 'start',
            stop = 'stop',
            buffer = audio.context.createBufferSource();

        if (typeof buffer.start !== 'function') {
            start = 'noteOn';
        }
        audio.compatibility.start = start;

        if (typeof buffer.stop !== 'function') {
            stop = 'noteOff';
        }
        audio.compatibility.stop = stop;
    })();

    //-------------------------------
    // Setup Audio Files and Buttons
    //-------------------------------
    for (var a in audio.files) {
        (function() {
            var i = parseInt(a);
            var req = new XMLHttpRequest();
            req.open('GET', audio.files[i], true); // array starts with 0 hence the -1
            req.responseType = 'arraybuffer';
            req.onload = function() {
                audio.context.decodeAudioData(
                    req.response,
                    function(buffer) {
                        audio.buffer[i] = buffer;
                        audio.source_loop[i] = {};
                        var button = document.getElementById(i);
                        button.addEventListener('click', function(e) {
                            e.preventDefault();
                            audio.play(this.value);
                        });

                    },
                    function() {
                        console.log('Error decoding audio "' + audio.files[i] + '".');
                    }
                );
            };
            req.send();
        })();
    }


}