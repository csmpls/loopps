from flask import Flask, redirect, url_for, session, request
from flask import g, session, request, url_for, flash
from flask import redirect, render_template, jsonify
from app import app
from models import *



# data
collections = [
	Collection('Though the way you float through space & time evaporates just as quickly', 
		[
		Song('there are no paths paths are made by walking', 'there-are-no-paths.mp3'), 
		Song('champs des possibles', 'champs-des-possibles.mp3'),
		Song('goal', 'goal.mp3')
		],
		'#7881FF',
		'#eee'
	),
	Collection('charlotte untitled loops',
		[Song('1','1.wav')],
		'#ccc',
		'#333'
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
