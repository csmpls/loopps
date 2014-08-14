from app import app


# users

#  follow this: https://www.openshift.com/blogs/use-flask-login-to-add-user-authentication-to-your-python-application


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
		