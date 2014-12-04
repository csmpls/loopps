from flask import Flask, redirect, url_for, session, request
from flask import g, session, request, url_for, flash
from flask import redirect, render_template, jsonify

app = Flask(__name__)

# music
class Collection:
        def __init__(self, title, songs, cursorColor, bgColor):
                self.title = title
                self.songs = songs
                self.cursorColor = cursorColor
                self.bgColor = bgColor

class Song:
        def __init__(self, title, filename):
                self.title = title
                self.filename = filename

# data
collections = [
	Collection('Though the way you move through space & time evaporates just as quickly', 
		[
		Song('there are no paths paths are made by walking', 'there-are-no-paths.mp3'), 
		Song('CHAMPS des possibles', 'champs-des-possibles.mp3')
#		Song('goal', 'goal.mp3')
		],
		'#7881FF',
		'#eee'
	),
	Collection('_',
		[Song('','1.wav')],
		'#ccc',
		'#eee'
	)
]





# views
@app.route('/')
def index():
	all_song_filenames = get_all_filenames_from(collections)
	print all_song_filenames
	
	return render_template(
		'index.html', 
		collections=collections, 
		all_song_filenames=all_song_filenames)














# functions
def get_all_filenames_from(collections):
	all_song_filenames = []
	for collection in collections:
		all_song_filenames.extend(
			[song.filename for song in collection.songs]
		)
	return all_song_filenames





SECRET_KEY = 'a555c33332'
app.secret_key = SECRET_KEY
app.run(port=29717, debug = True)
