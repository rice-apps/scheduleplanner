import xml.etree.cElementTree as ET
tree = ET.ElementTree(file = 'C:\\Users\\Ziliang Zhu\\Desktop\\course_data.xml')
root = tree.getroot()

course_dict_list = []

def add_tag_information_helper(tag):
    counter = 0
    for i in root.iter(tag):
        course_dict_list[counter][tag] = i.text
        counter += 1

for i in root.iter('course'):
    course_dict_list.append({})

# add term-code key and value into the dictionaries
add_tag_information_helper('term-code')

# add term-description key and value
add_tag_information_helper('term-description')

# add subject key and value
add_tag_information_helper('subject')

# course-number
add_tag_information_helper('course-number')

# section
add_tag_information_helper('section')

# school
add_tag_information_helper('school')

# department
add_tag_information_helper('department')

# crn
add_tag_information_helper('crn')

# title
add_tag_information_helper('title')

# description
add_tag_information_helper('description')

# credit-hours
add_tag_information_helper('credit-hours')

# session
add_tag_information_helper('session')

# location
add_tag_information_helper('location')

# instructor
add_tag_information_helper('instructor')

# max-enrollment
add_tag_information_helper('max-enrollment')

# actual-enrollment
add_tag_information_helper('actual-enrollment')

# xlst-wait-capacity
add_tag_information_helper('xlst-wait-capacity')

# xlst-wait-count
add_tag_information_helper('xlst-wait-count')

# catalog-inst-permission
add_tag_information_helper('catalog-inst-permission')

# class-restrictions
add_tag_information_helper('class-restrictions')

# level-restrictions
add_tag_information_helper('level-restrictions')

# xlink-course
add_tag_information_helper('xlink-course')

# print all the dict for test
for i in course_dict_list:
    print i
