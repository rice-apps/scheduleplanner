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
API_URL = "http://courses.rice.edu/admweb/!SWKSECX.main?term=%s%s&title=&course=&crn=&coll=&dept=&subj="

terms_on_server = {
	"FallTerm" : "10",
	"SpringTerm" : "20",
	"SummerTerm" : "30"
}

def pull_from_file():
	""" Pulls course XML data from a local file. """
	with file(API_FILE) as f:
		return f.read()
	return None

def pull_from_server(url):
	""" Pulls course XML data from a remote server. """
	#print "Python -- HTTP/1.1 GET " + API_URL
	data = urlopen(url)

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

def get_courses(year, term):
	#url = API_URL % (year, terms_on_server[term])
	#data = pull_from_server(url)
	data = pull_from_file()
	return parse_xml(data)

if __name__ == '__main__':
	print "You should import this module."