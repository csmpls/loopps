from flask import Flask, redirect, url_for, session, request
from flask import g, session, request, url_for, flash
from flask import redirect, render_template, jsonify
from app import app

class Collection:

	def __init__(self, title, songs):
		self.title = title
		self.songs = songs

class Song:

	def __init__(self, title, filename):
		self.title = title
		self.filename = filename


songs = [
	Song('there are no paths paths are made by walking', 'there-are-no-paths.mp3'), 
	Song('champs des possibles', 'champs-des-possibles.mp3')
	]

collections = [
	Collection('The way you float', songs)
	]


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/looptest')
def looptest():
	all_song_filenames = []
	for collection in collections:
		all_song_filenames.extend(
			[song.filename for song in collection.songs]
		)

	print all_song_filenames

	return render_template(
		'looptest.html', 
		collections=collections, 
		all_song_filenames=all_song_filenames)
