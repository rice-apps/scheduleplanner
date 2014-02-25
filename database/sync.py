"""
	This module will synchronize the database with the provided list of courses.
"""

import pymysql
from time import time

class DatabaseSynchronizer:
	def __init__(this, year, term, keys, courses, db):
		this.year = year;
		this.term = term;
		this.keys = keys;
		this.courses = courses;
		this.db = db;
		this.terms = {
			'FallTerm' : 0,
			'SpringTerm' : 1,
			'SummerTerm' : 2
		}
		this.colleges = {
			'Baker' : 0,
			'Duncan' : 1,
			'McMurtry' : 2,
			'Martel' : 3,
			'Jones' : 4,
			'Brown' : 5,
			'Wiess' : 6,
			'SidRichardson' : 7,
			'Hanszen' : 8,
			'Lovett' : 9,
			'WillRice' : 10
		}
		this.days = {
			'U' : 0,
			'M' : 1,
			'T' : 2,
			'W' : 3,
			'R' : 4,
			'F' : 5,
			'S' : 6
		}

	def sync(this):
		print "Synchronizing %d courses..." % len(this.courses)

		# Go through all the courses...
		for i in xrange(len(this.courses)):
			course = this.courses[i]

			# Print periodic status updates.
			if i % 200 == 0:
				print "%d / %d (%2f)" % (i+1, len(this.courses), float(i+1)/len(this.courses)*100)

			# Process the course into the database.
			instructorids = this.parse_instructors(course)
			courseid = this.parse_course(course)
			this.parse_course_instructors(courseid, instructorids)
			this.parse_course_times(courseid, course)
			this.parse_course_restrictions(courseid, course)
			break

	def parse_instructors(this, course):
		""" """
		instructorids = []
		query = "INSERT INTO `instructors` (`name`) VALUES (%(name)s);"
		check = "SELECT `instructorid` FROM `instructors` WHERE `name` = %(name)s;"

		# may be of the format Last,First;Last2,First2...
		if 'instructor' not in course:
			return []
		instructors = course['instructor']

		for instructor in instructors.split(";"):
			this.db.execute(check, {
				'name' : instructor
			});

			if(this.db.rowcount > 0):
				instructorids.append( this.db.fetchone()['instructorid'] )
				continue

			this.db.execute(query, {
				'name' : instructor
			})
			instructorids.append(this.db.lastrowid)

		return instructorids

	def parse_course(this, course):

		data_map = {
			'crn' : 'crn',
			'description' : 'description',
			'enrollment' : 'actual-enrollment',
			'max_enrollment' : 'max-enrollment',
			'xlist_waitlisted' : 'xlst-wait-count',
			'xlist_max_waitlisted' : 'xlst-wait-capacity',
			'waitlisted' : 'xlst-wait-count',
			'max_waitlisted' : 'xlst-wait-capacity',
			'xlist_group' : 'xlist-group',
			'department' : 'department',
			'title' : 'title',
			'subject' : 'subject',
			'school' : 'school',
			'section' : 'section',
			'link' : 'xlink-course',
			'xlist_enrollment' : 'xlst-actual-enrollment',
			'xlist_max_enrollment' : 'xlst-max-enrollment',
			'course_number' : 'course-number'
		}

		data = {
			'last_update' : int(time()),
			'term' : this.terms[this.term],
			'year' : this.year
		}

		# Check if the course already exists...
		check = "SELECT `courseid` FROM `courses` WHERE `year` = %(year)s AND `term` = %(term)s AND `crn` = %(crn)s;"
		this.db.execute(check, {
			'year' : this.year,
			'term' : this.terms[this.term],
			'crn' : course['crn']
		});
		if this.db.rowcount > 0:
			data['courseid'] = this.db.fetchone()['courseid']

		if 'TO' in course['credit-hours']:
			values = course['credit-hours'].split(" TO ");
			data['credit_hours_min'] = values[0];
			data['credit_hours_max'] = values[1];
		else:
			data['credit_hours'] = course['credit-hours']
			data['credit_hours_min'] = course['credit-hours']
			data['credit_hours_max'] = course['credit-hours']

		if course['subject'] == 'LPAP':
			data['credit_lpap'] = 1
		else:
			data['credit_lpap'] = 0

		if 'distribution-group' in course:
			if course['distribution-group'] == 'Distribution Group I':
				course['credit_distribution'] = 1;
			if course['distribution-group'] == 'Distribution Group II':
				course['credit_distribution'] = 2;
			if course['distribution-group'] == 'Distribution Group III':
				course['credit_distribution'] = 3;

		for item in data_map:
			if data_map[item] in course:
				data[item] = course[data_map[item]]

		keys = ""
		values = ""

		for item in data:
			keys += "`"+item+"`, "
			values += "%("+item+")s, "
		keys = keys[0:-2]
		values = values[0:-2]
		
		if 'courseid' in data:
			query = "REPLACE INTO `courses` ("+keys+") VALUES ("+values+");"
		else:
			query = "INSERT INTO `courses` ("+keys+") VALUES ("+values+");"
		this.db.execute(query, data)
		courseid = this.db.lastrowid
		return courseid

	def parse_course_instructors(this, courseid, instructorids):
		delete = "DELETE FROM `course_instructors` WHERE `courseid` = %(courseid)s;"
		insert = "INSERT INTO `course_instructors` (`courseid`, `instructorid`) VALUES (%(courseid)s, %(instructorid)s);"

		this.db.execute(delete, {'courseid' : courseid})

		for instructorid in instructorids:
			this.db.execute(insert, {
				'courseid' : courseid,
				'instructorid' : instructorid
			});

	def parse_course_times(this, courseid, course):
		"""
			 <start-time>1430, 1500</start-time>
			 <end-time>1545, 1615</end-time>
			 <meeting-days>TR, W</meeting-days>
			 <location>DCH Sym II Lab, DCH 1070</location>
		"""

		if 'start-time' not in course:
			return

		start_times = course['start-time'].split(", ")
		end_times = course['end-time'].split(", ")
		meeting_days = course['meeting-days'].split(", ")
		locations = course['location'].split(", ")

		insert = """
		INSERT INTO `course_times` (`time_start`, `time_end`, `day`, `building_code`, `room_number`)
		VALUES (%(time_start)s, %(time_end)s, %(day)s, %(building_code)s, %(room_number)s);
		"""
		delete = "DELETE FROM `course_times` WHERE `courseid` = %(courseid)s;"
		this.db.execute(delete, {'courseid' : courseid})

		for i in xrange(len(start_times)):
			if i >= len(locations):
				loc = locations[0].split(" ")
			else:
				loc = locations[i].split(" ")

			room = ""
			for substr in loc[1:]:
				room += substr

			data = {
				'time_start' : start_times[i],
				'time_end' : end_times[i],
				'day' : None,
				'building_code' : loc[0],
				'room_number' : room
			}

			if data['room_number'] == '' and data['building_code'] == loc[0]:
				data['room_number'] = 'TBA'

			for day in meeting_days[i]:
				data['day'] = this.days[day]
				this.db.execute(insert, data);

	def parse_course_restrictions(this, courseid, course):
		return

"""
courses:
  `college` int(16) UNSIGNED NULL,
  `course_url` varchar(255) NULL,
  `session_type` int(32) UNSIGNED NOT NULL, /* see courses.rice.edu*/
  `grade_type` int(32) UNSIGNED NOT NULL,
course_restrictions:
  `courseid` int(64) UNSIGNED NOT NULL,
  `restriction_type` int(32) UNSIGNED NOT NULL,
  `target` int(64) UNSIGNED NOT NULL,
  `target_subject` varchar(4) NOT NULL,
  `target_course_number` int(16) UNSIGNED NOT NULL,
  `description` varchar(128) NOT NULL DEFAULT ''

  CoursePrerequisite = 0,
  CourseCorequisite = 1,
  InstructorPermission = 2,
  RegistrarPermission = 3,
  Major = 4,
  Program = 5,
  Classification = 6,
  Level = 7,
"""

from pull import get_courses

if __name__ == '__main__':
	print "Course Sync Started..."
	year = "2013"
	term = "FallTerm"
	courses, keys = get_courses(year, term)
	db = pymysql.connect(host='127.0.0.1', port=3306, user='httpd', passwd='httpd', db='riceapps', charset='utf8')
	db.autocommit(True)
	cur = db.cursor(pymysql.cursors.DictCursor)
	cur.execute('SET NAMES utf8;')
	cur.execute('SET CHARACTER SET utf8;')
	cur.execute('SET character_set_connection=utf8;')
	sync = DatabaseSynchronizer(year, term, keys, courses, cur)
	sync.sync()
	cur.close()
	db.close()
	print "Course Sync Ended!"
