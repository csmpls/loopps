#!bin/python

from app import app

SECRET_KEY = 'a555c33332'
app.secret_key = SECRET_KEY
app.run(host="127.0.0.1", port=8888, debug = True)
