from flask import Flask, redirect, url_for, session, request
from flask import g, session, request, url_for, flash
from flask import redirect, render_template, jsonify
from app import app


@app.route('/')
def index():

	return render_template('index.html')
