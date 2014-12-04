from flask import Flask, redirect, url_for, session, request
from flask import g, session, request, url_for, flash
from flask import redirect, render_template, jsonify
from app import app


# models
class Collection:
	def __init__(self, title, songs):
		self.title = title
		self.songs = songs

class Song:
	def __init__(self, title, filename):
		self.title = title
		self.filename = filename


# data
collections = [
	Collection('Though way you float through space & time evaporates just as quickly', [
		Song('there are no paths paths are made by walking', 'there-are-no-paths.mp3'), 
		Song('champs des possibles', 'champs-des-possibles.mp3'),
		Song('goal', 'goal.mp3')
		]
	)
]


# views
@app.route('/')
def index():
	return render_template('index.html')

@app.route('/looptest')
def looptest():
	all_song_filenames = get_all_filenames_from(collections)
	print all_song_filenames
	
	return render_template(
		'looptest.html', 
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
