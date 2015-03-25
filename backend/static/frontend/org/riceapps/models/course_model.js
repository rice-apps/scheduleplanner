/**
 * A course model is a class that represents a single course and provides convenient methods to access information about
 * that course.
 */

goog.provide('org.riceapps.models.CourseModel');

goog.require('goog.Promise');
goog.require('goog.color');
goog.require('goog.array');
goog.require('org.riceapps.models.Model');
goog.require('org.riceapps.models.InstructorModel');
goog.require('org.riceapps.protocol.Messages');

goog.scope(function() {



/**
 * @param {!org.riceapps.protocol.Messages.Course} data
 * @param {!org.riceapps.models.CoursesModel} coursesModel
 * @extends {org.riceapps.models.Model}
 * @constructor
 */
org.riceapps.models.CourseModel = function(data, coursesModel) {
  goog.base(this);

  /** @private {!org.riceapps.protocol.Messages.Course} */
  this.data_ = data;

  /** @private {!org.riceapps.models.CoursesModel} */
  this.coursesModel_ = coursesModel;

  /** @private {goog.color.Rgb} */
  this.color_ = null;

  /** @private {!Array.<!org.riceapps.models.InstructorModel>} */
  this.instructorModels_ = [];

  for (var i = 0; i < this.data_['instructors'].length; i++) {
    this.instructorModels_.push(new org.riceapps.models.InstructorModel(this.data_['instructors'][i]));
  }

  /** @private {Array.<!org.riceapps.models.CourseModel>} */
  this.otherSections_ = null;
};
goog.inherits(org.riceapps.models.CourseModel,
              org.riceapps.models.Model);
var CourseModel = org.riceapps.models.CourseModel;


/**
 * Represents the state of the filters for a given query.
 *
 * @typedef {{
 *   normal: boolean,
 *   d1: boolean,
 *   d2: boolean,
 *   d3: boolean,
 *   conflicts: boolean,
 *   full: boolean
 * }}
 */
CourseModel.Filter;


/** @enum {number} */
CourseModel.Term = {
  FALL: 0,
  SPRING: 1,
  SUMMER: 2
};


/**
 * Represents a time and place at which the course meets.
 *   day: 0 (Sunday) to 6 (Saturday)
 *   start: time at which course starts in hours elapsed since midnight
 *   end: time at which course ends in hours elapsed since midnight
 *   location: classroom where this meeting occurs
 *
 * @typedef {{
 *   day: {number},
 *   start: {number},
 *   end: {number},
 *   location: {string}
 * }}
 */
CourseModel.MeetingTime;


/**
 * @return {number}
 */
CourseModel.prototype.getId = function() {
  return this.data_['courseId'];
};


/**
 * @return {boolean}
 */
CourseModel.prototype.assertDistribution = function(type) {
  return this.getDistributionType() === type;
}


/**
 * @param {!CourseModel.Filter} filters
 * @param {org.riceapps.models.UserModel=} opt_userModel
 * @return {boolean}
 */
CourseModel.prototype.passesFilters = function(filters, opt_userModel) {
  var distributionResponses = {
    "normal": 0,
    "d1": 1,
    "d2": 2,
    "d3": 3
  };

  return (
      (filters.normal && this.assertDistribution(0)) ||
      (filters.d1 && this.assertDistribution(1)) ||
      (filters.d2 && this.assertDistribution(2)) ||
      (filters.d3 && this.assertDistribution(3)));
};


/**
 * Returns all of the meeting times for the course.
 * @return {!Array.<!CourseModel.MeetingTime>}
 */
CourseModel.prototype.getMeetingTimes = function() {
  var times = [];

  for (var i = 0; i < this.data_['meetingTimes'].length; i++) {
    // NOTICE: The reason for subtraction and division here is because the
    // format returned by the back-end differs from the values expected by
    // the other front-end components.
    var time = this.data_['meetingTimes'][i];
    var t = {
      'day' : time['day'] - 1,
      'start' : time['start'] / 60,
      'end' : time['end'] / 60,
      'location' : time['building'] + ' ' + time['room']
    };
    times.push(t);
  }
  return times;
};


/**
 * Returns all course meeting times that can be displayed on the calendar.
 * @return {!Array.<!CourseModel.MeetingTime>}
 */
CourseModel.prototype.getCalendarMeetingTimes = function() {
  var times = [];

  for (var i = 0; i < this.data_['meetingTimes'].length; i++) {
    // NOTICE: The reason for subtraction and division here is because the
    // format returned by the back-end differs from the values expected by
    // the other front-end components.
    var time = this.data_['meetingTimes'][i];
    var t = {
      'day' : time['day'] - 1,
      'start' : time['start'] / 60,
      'end' : time['end'] / 60,
      'location' : time['building'] + ' ' + time['room']
    };

    if (t['day'] < 0 || t['day'] > 4) {
      continue;
    }

    times.push(t);
  }

  return times;
};


/**
 * Returns the category that the course belongs to. The category is not guaranteed to be unique, as a single course may
 * have multiple sessions.
 * @return {string}
 */
CourseModel.prototype.getCourseCategory = function() {
  // A (subject, course number) pair uniquely identifies a course (which may have other sessions with different course
  // ids).
  return this.getSubject() + ' ' + this.getCourseNumber();
};


/**
 * Returns the days, times, and locations for the course.
 * @return {string}
 */
CourseModel.prototype.getMeetingTimesAsString = function() {
  var times = this.getMeetingTimes();

  var days = {0: 'M', 1: 'T', 2:'W', 3:'R', 4:'F', 5:'S', 6:'U'}

  if (times.length == 0) {
    return 'TBD';
  }
  var meeting_times_string = ''

  for (var i = 0; i < times.length; i++) {
    meeting_times_string += days[times[i]['day']] + ' ' + this.timeToString(times[i]['start']) + '-' + this.timeToString(times[i]['end']) + ' (' + times[i]['location'] + ')' + ' / ';
  }

  return meeting_times_string.substring(0,meeting_times_string.length -2);
};

/**
* Returns time as a string in standard hh:mm format.
* @return {string}
*/
CourseModel.prototype.timeToString = function(time) {
  var hour = Math.floor(time);
  var min = Math.floor((time - hour) * 60);
  if (min < 10) {
    return '' + hour + ':0' + min;
  } else {
  return '' + hour + ":" + min;
  }
}

/**
 * Returns the names of all instructors as a string.
 * @return {string}
 */
CourseModel.prototype.getInstructorNames = function() {
  if (this.instructorModels_.length == 0) {
    return 'TBD';
  }

  var data = '';

  for (var i = 0; i < this.instructorModels_.length; i++) {
    data += this.instructorModels_[i].getName() + '; ';
  }

  return data.substring(0, data.length - 2);
};


/**
 * Returns all instructors for the course.
 * @return {!Array.<!org.riceapps.models.InstructorModel>}
 */
CourseModel.prototype.getInstructors = function() {
  return this.instructorModels_;
};


/**
 * Returns the first instructor for the course.
 * @return {!org.riceapps.models.InstructorModel}
 */
CourseModel.prototype.getInstructor = function() {
  if (this.instructorModels_.length == 0) {
    return new org.riceapps.models.InstructorModel(/** @type {org.riceapps.protocol.Messages.Instructor} */ ({
      'instructorId': 0,
      'instructorName': 'TBD'
    }));
  }

  return this.instructorModels_[0];
};


/**
 * @return {number}
 */
CourseModel.prototype.getCrn = function() {
  return this.data_['crn'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getFormattedTermCodeForPrevYear = function() {
  var year = this.getYear() - 1;
  var term;

  switch (this.getTerm()) {
    default: // fall through
    case CourseModel.Term.FALL:
      term = '10';
      break;
    case CourseModel.Term.SPRING:
      term = '20';
      break;
    case CourseModel.Term.SUMMER:
      term = '30';
      break;
  }

  return year + term;
};


/**
 * Returns the four character course subject code (e.g. 'MATH').
 * @return {string}
 */
CourseModel.prototype.getSubject = function() {
  return this.data_['subject'];
};


/**
 * Returns the three digit course number (e.g. 101).
 * @return {number}
 */
CourseModel.prototype.getCourseNumber = function() {
  return this.data_['courseNumber'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getSubjectAndCourseNumber = function() {
  return this.data_['subject'] + ' ' + this.data_['courseNumber'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getTitle = function() {
  return this.data_['subject'] + ' ' + this.data_['courseNumber'] + ': ' + this.data_['title'];
};

/**
 * This function gives you the score for how well this course matches the query.
 * Correct number is a score of 3, correct subject is a score of 2, correct title is a score of 1.
 * @param {string} query
 * @return {number}
 */
CourseModel.prototype.getMatchScore = function(query, queryNumber) {
  var total = 0;

  if (queryNumber === this.data_['courseNumber'] + '') {
    total += 3;
  } else if (queryNumber === (this.data_['courseNumber'] + '').substring(0,2)) {
    total += 2.5;
  } else if (queryNumber === (this.data_['courseNumber'] + '').substring(0,1)) {
    total += 2.2;
  }

  var foundInstructor = false;
  for (var i = 0; i < this.instructorModels_.length; i++) {
    if (goog.string.caseInsensitiveContains(this.instructorModels_[i].getName(), query)) {
      foundInstructor = true;
    }
  }

  if (foundInstructor) {
    total += 0.8;
  }


  if (goog.string.caseInsensitiveContains(query, this.data_['subject'])) {
    total += 2;
  }

  if (goog.string.caseInsensitiveContains(this.data_['title'], query)) {
    total += 1;
  }

  if (goog.string.caseInsensitiveContains(this.data_['title'], this.data_['subject'])) {
    total -= 1;
  }

  return total;
};


/**
 * @return {string}
 */
CourseModel.prototype.getCreditsAsString = function() {
  if (this.data_['creditHoursMin'] != this.data_['creditHoursMax']) {
    return this.data_['creditHoursMin'] + ' to ' + this.data_['creditHoursMax'];
  }

  return this.data_['creditHours'] + '';
};


/**
 * @return {number}
 */
CourseModel.prototype.getCredits = function() {
  return this.data_['creditHours'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getCreditsMin = function() {
  return this.data_['creditHoursMin'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getCreditsMax = function() {
  return this.data_['creditHoursMax'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getDistributionType = function() {
  return this.data_['distributionGroup'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getDistributionTypeAsString = function() {
  switch(this.data_['distributionGroup']) {
    case 1:
      return 'I';
    case 2:
      return 'II';
    case 3:
      return 'III';
    default:
      return '';
  }
};


/**
 * @return {number}
 */
CourseModel.prototype.getDistributionOneCredits = function() {
  return this.getDistributionType() == 1 ? this.getCredits() : 0;
};


/**
 * @return {number}
 */
CourseModel.prototype.getDistributionTwoCredits = function() {
  return this.getDistributionType() == 2 ? this.getCredits() : 0;
};


/**
 * @return {number}
 */
CourseModel.prototype.getDistributionThreeCredits = function() {
  return this.getDistributionType() == 3 ? this.getCredits() : 0;
};


/**
 * Returns all sections of the current course (including this one).
 * @return {!Array.<!CourseModel>}
 */
CourseModel.prototype.getAllSections = function() {
  if (this.otherSections_) { // Cache since this calculating this is potentially expensive.
    return this.otherSections_;
  }

  this.otherSections_ = this.coursesModel_.getAllSections(this);
  return this.otherSections_;
};


/**
 * An array from which to assign colors to courses; each are [R,G,B] tuples.
 * @const {!Array.<!goog.color.Rgb>}
 */
CourseModel.COLORS = [ // from http://www.google.com/design/spec/style/color.html#color-color-palette
  [242, 245, 246], // Gray
  [244,  67,  54], // Red
  //[233,  30,  99], // Pink
  //[156,  39, 176], // Purple
  [103,  58, 183], // Deep Purple
  [ 63,  81, 181], // Indigo
  [ 33, 150, 243], // Blue
  [  3, 169, 244], // Light Blue
  [  0, 188, 212], // Cyan
  [  0, 150, 136], // Teal
  [ 76, 175,  80], // Green
  //[139, 195,  74], // Light Green
  //[205, 220,  57], // Lime
  [255, 235,  59], // Yellow
  [255, 193,   7], // Amber
  [255, 152,   0], // Orange
  [255,  87,  34], // Deep Orange
  [ 96, 125, 139] // Blue Grey
];


/**
 * @type {number}
 */
CourseModel.NEXT_COLOR = 0;


/**
 * Returns color that should be used to represent this course on the UI.
 * @return {!goog.color.Rgb}
 */
CourseModel.prototype.getColor = function() {
  if (this.color_) {
    return this.color_;
  }

  this.color_ = CourseModel.COLORS[CourseModel.NEXT_COLOR];
  CourseModel.NEXT_COLOR = (CourseModel.NEXT_COLOR + 1) % CourseModel.COLORS.length;
  return this.color_;
};


/**
 * @return {!Array.<string>}
 */
CourseModel.prototype.getRestrictions = function() {
  var restrictions = [];

  for (var i = 0; i < this.data_['restrictions'].length; i++) {
    restrictions.push(this.data_['restrictions'][i]['description']);
  }

  return restrictions;
};


/**
 * @return {number}
 */
CourseModel.prototype.getTerm = function() {
  return this.data_['term'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getTermAsString = function() {
  switch(this.data_['term']) {
    case CourseModel.Term.FALL:
      return 'Fall';
    case CourseModel.Term.SPRING:
      return 'Spring';
    case CourseModel.Term.SUMMER:
      return 'Summer';
    default:
      return 'Unknown';
  }
};


/**
 * @return {number}
 */
CourseModel.prototype.getYear = function() {
  return this.data_['year'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getCollege = function() {
  return this.data_['college'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getLastUpdateTime = function() {
  return this.data_['lastUpdate'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getCourseUrl = function() {
  return this.data_['courseUrl'] || '';
};


/**
 * @return {string}
 */
CourseModel.prototype.getLink = function() {
  return this.data_['link'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getDescription = function() {
  return this.data_['description'];
};


/**
 * @return {boolean}
 */
CourseModel.prototype.isLpap = function() {
  return this.data_['creditLpap'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getDepartment = function() {
  return this.data_['department'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getSchool = function() {
  return this.data_['school'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getSection = function() {
  return this.data_['section'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getSessionType = function() {
  return this.data_['sessionType'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getGradeType = function() {
  return this.data_['gradeType'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getCrosslistGroup = function() {
  return this.data_['xlistGroup'];
};


/**
 * @return {boolean}
 */
CourseModel.prototype.isCrosslisted = function() {
  return this.data_['xlistGroup'].length > 0;
};


/**
 * @param {!CourseModel} otherCourse
 * @return {boolean}
 */
CourseModel.prototype.isCrosslistedWith = function(otherCourse) {
  return this.data_['xlistGroup'] == otherCourse.data_['xlistGroup'];
};


/**
 * Returns all crosslisted sections of the current course (including this one).
 * @param {boolean} opt_hideSelf
 * @return {!Array.<!CourseModel>}
 */
CourseModel.prototype.getAllCrosslistedSections = function(opt_hideSelf) {
  var data = this.coursesModel_.getAllCrosslistedSections(this);

  if (opt_hideSelf) {
    goog.array.remove(data, this);
  }

  return data;
};


/**
 * Returns titles of all crosslisted sections of the current course (excluding this one) as a string.
 * @return {!Array.<string>}
 */
CourseModel.prototype.getAllCrosslistedSectionsAsString = function() {
  var data = this.getAllCrosslistedSections();
  var titles = [];

  for (var i = 0; i < data.length; i++) {
    if (!goog.array.contains(titles, data[i].getSubjectAndCourseNumber()) &&
        data[i].getSubjectAndCourseNumber() != this.getSubjectAndCourseNumber()) {
      goog.array.insert(titles, data[i].getSubjectAndCourseNumber());
    }
  }

  return titles.join('/');
};


/**
 * @return {number}
 */
CourseModel.prototype.getCrosslistEnrollment = function() {
  return this.data_['xlistEnrollment'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getCrosslistWaitlisted = function() {
  return this.data_['xlistWaitlisted'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getCrosslistMaxEnrollment = function() {
  return this.data_['xlistMaxEnrollment'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getCrosslistMaxWaitlisted = function() {
  return this.data_['xlistMaxWaitlisted'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getMaxEnrollment = function() {
  return this.data_['maxEnrollment'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getMaxWaitlisted = function() {
  return this.data_['maxWaitlisted'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getEnrollment = function() {
  return this.data_['enrollment'];
};


/**
 * @return {number}
 */
CourseModel.prototype.getWaitlisted = function() {
  return this.data_['waitlisted'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getTotalEnrollmentAsString = function() {
  if (this.getCrosslistGroup()) {
    return this.data_['xlistEnrollment'] + ' / ' + this.data_['xlistMaxEnrollment'] + '*';
  }

  return this.data_['enrollment'] + ' / ' + this.data_['maxEnrollment'];
};


/**
 * @return {string}
 */
CourseModel.prototype.getTotalWaitlistedAsString = function() {
  if (this.getCrosslistGroup()) {
    return this.data_['xlistWaitlisted'] + ' / ' + this.data_['xlistMaxWaitlisted'] + '*';
  }

  return this.data_['waitlisted'] + ' / ' + this.data_['maxWaitlisted'];
};

});  // goog.scope
