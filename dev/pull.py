"""

"""

from urllib2 import urlopen
from xml.dom import minidom

API_FILE = "./data.xml"
API_URL = "http://courses.rice.edu/admweb/!SWKSECX.main?term=201320&title=&course=&crn=&coll=&dept=&subj="

def pull_from_file():
	with file(API_FILE) as f:
		return f.read()
	return None

def pull_from_server():
	return None

def parse_xml(xml):
	print "Parsing..."
	xml = xml[xml.find("<courses>")+len("<courses>"):xml.find("</courses>")]


	return xml

if __name__ == '__main__':
	data = pull_from_file()
	print parse_xml(data)