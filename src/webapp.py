"""
	Rice University Schedule Planner

	Created by:
		Matthew Schurr
		Abdul Nimeri
		Glenn Zhu

"""

from flask import Flask, send_from_directory

app = Flask(__name__)

# ----------------------------------------------------
# Routes
# ----------------------------------------------------

@app.route("/")
def index_get():
	""" Returns the home page. """
	pass

@app.route("/login")
def login_get():
	""" Redirects the user to the Network ID authentication service. """
	pass

@app.route("/login-return")
def login_return_get():
	""" Verifies whether or not NetID Auth was successful. Redirects to home page. """
	pass

@app.route("/logout")
def logout_get():
	""" Terminates the user's session and redirects to home page. """
	pass

# ----------------------------------------------------
# JSON API Routes
# ----------------------------------------------------

# -- Courses API

@app.route("/api/course/<int:courseid>")
def api_course_get(courseid):
	""" Returns information about a particular course. """
	pass

@app.route("/api/courses")
def api_courses_get():
	""" Returns information about a group of courses (optionally modified by GET parameter filters). """
	pass

# -- Playgrounds API (bound to session)
@app.route("/api/playgrounds")
def api_playgrounds_get():
	""" Returns all courses contained in active user's playground. """
	pass

@app.route("/api/playgrounds/<int:courseid>", methods=["PUT"])
def api_playgrounds_put(courseid):
	""" Puts a course into the active user's playground. """
	pass

@app.route("/api/playgrounds/<int:courseid>", methods=["DELETE"])
def api_playgrounds_delete(courseid):
	""" Removes a course form the active user's playground. """
	pass

# -- Schedules API (bound to session)
@app.route("/api/schedules/<int:year>")
def api_schedules_get(year):
	""" Returns all of the courses on the user's schedule for a given year. """
	pass

@app.route("/api/schedules/<int:year>/<int:courseid>", methods=["PUT"])
def api_schedules_put(year, courseid):
	""" Adds a course to the user's schedule. """
	pass

@app.route("/api/schedules/<int:year>/<int:courseid>", methods=["DELETE"])
def api_schedules_delete(year, courseid):
	""" Deletes a course from teh user's schedule. """
	pass

# ----------------------------------------------------
# Development Environment Coniguration
# ----------------------------------------------------

if __name__ == '__main__':
	app.debug = True
	app.run()







