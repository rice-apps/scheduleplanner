"""
Interfaces with Rice University's XML course feed and processes the XML into a native dictionary.

Usage:
	from module import get_courses
	courses = get_courses()
	print courses[0]
"""

from urllib2 import urlopen
import xml.etree.cElementTree as ET

API_FILE = "./data.xml"
API_URL = "http://courses.rice.edu/admweb/!SWKSECX.main?term=201320&title=&course=&crn=&coll=&dept=&subj="

def pull_from_file():
	""" Pulls course XML data from a local file. """
	with file(API_FILE) as f:
		return f.read()
	return None

def pull_from_server():
	""" Pulls course XML data from a remote server. """
	#print "Python -- HTTP/1.1 GET " + API_URL
	data = urlopen(API_URL)

	if data.getcode() != 200:
		#print "ERROR!"
		return None

	#print "DONE!"
	return data.read()

def parse_xml(xml):
	""" Processes inputted course XML into a dictionary and set of keys. """
	root = ET.fromstring(xml)
	courses = []
	keys = set([])

	# Populate the list.
	for elem in root.iter('course'):
		course = {}

		for child in elem.iter():
			course[child.tag] = child.text
			keys.add(child.tag)

		courses.append(course)

	# Return the list.
	return courses, keys

def get_courses():
	data = pull_from_server()
	courses, keys = parse_xml(data)
	return courses, keys

if __name__ == '__main__':
	print "You should import this module."