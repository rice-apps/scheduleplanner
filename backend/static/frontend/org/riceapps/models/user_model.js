goog.provide('org.riceapps.models.UserModel');

goog.require('goog.array');
goog.require('org.riceapps.events.UserModelEvent');
goog.require('org.riceapps.models.Model');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.protocol.Messages');
goog.require('org.riceapps.utils.FakeData');

goog.scope(function() {
var CourseModel = org.riceapps.models.CourseModel;
var UserModelEvent = org.riceapps.events.UserModelEvent;



/**
 * @param {!org.riceapps.protocol.Messages.User} data
 * @extends {org.riceapps.models.Model}
 * @constructor
 */
org.riceapps.models.UserModel = function(data) {
  goog.base(this);

  /** @private {?org.riceapps.protocol.Messages.User} */
  this.protocolMessage_ = data;

  /** @private {!Array.<!CourseModel>} */
  this.schedule_ = [];

  /** @private {!Array.<!CourseModel>} */
  this.playground_ = [];

  /** @private {number} */
  this.userId_ = data['userId'];

  /** @private {string} */
  this.userName_ = data['userName'];

  /** @private {string} */
  this.xsrfToken_ = data['xsrfToken'];

  /** @private {boolean} */
  this.hasSeenTour_ = data['hasSeenTour'];
};
goog.inherits(org.riceapps.models.UserModel,
              org.riceapps.models.Model);
var UserModel = org.riceapps.models.UserModel;


/**
 * @param {!org.riceapps.models.CoursesModel} coursesModel
 */
UserModel.prototype.initialize = function(coursesModel) {
  var playground = this.protocolMessage_['playground']['courses'];
  var schedule = this.protocolMessage_['schedule']['courses'];

  for (var i = 0; i < playground.length; i++) {
    var course = coursesModel.getCourseById(playground[i]['courseId']);
    this.playground_.push(course);
  }

  for (var i = 0; i < schedule.length; i++) {
    var course = coursesModel.getCourseById(schedule[i]['courseId']);
    this.schedule_.push(course);
  }

  this.protocolMessage_ = null;
}


/**
 * @return {number}
 */
UserModel.prototype.getUserId = function() {
  return this.userId_;
};


/**
 * @return {string}
 */
UserModel.prototype.getXsrfToken = function() {
  return this.xsrfToken_;
};


/**
 * @return {string}
 */
UserModel.prototype.getUserName = function() {
  return this.userName_;
};


/**
 * @return {boolean
 */
UserModel.prototype.hasSeenTour = function() {
  return this.hasSeenTour_;
};


/**
 * @param {!Array.<!CourseModel>} courses
 */
UserModel.prototype.addCoursesToPlayground = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    if (!goog.array.contains(this.playground_, courses[i])) {
      goog.array.insert(this.playground_, courses[i]);
    }
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.PLAYGROUND_COURSES_ADDED, courses));
};


/**
 * @param {!Array.<!CourseModel>} courses
 */
UserModel.prototype.removeCoursesFromPlayground = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    goog.array.remove(this.playground_, courses[i]);
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.PLAYGROUND_COURSES_REMOVED, courses));
};


/**
 * @return {!Array.<!CourseModel>}
 */
UserModel.prototype.getCoursesInPlayground = function() {
  return this.playground_;
};


/**
 * @param {!Array.<!CourseModel>} courses
 */
UserModel.prototype.addCoursesToSchedule = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    if (!goog.array.contains(this.schedule_, courses[i])) {
      goog.array.insert(this.schedule_, courses[i]);
    }
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.SCHEDULE_COURSES_ADDED, courses));
};


/**
 * @param {!Array.<!CourseModel>} courses
 */
UserModel.prototype.removeCoursesFromSchedule = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    goog.array.remove(this.schedule_, courses[i]);
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.SCHEDULE_COURSES_REMOVED, courses));
};


/**
 * @return {!Array.<!CourseModel>}
 */
UserModel.prototype.getCoursesInSchedule = function() {
  return this.schedule_;
};


});  // goog.scope
