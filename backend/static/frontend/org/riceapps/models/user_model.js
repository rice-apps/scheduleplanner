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
 * @return {boolean}
 */
UserModel.prototype.hasSeenTour = function() {
  return this.hasSeenTour_;
};


/**
 * @param {boolean} hasSeenTour
 */
UserModel.prototype.setHasSeenTour = function(hasSeenTour) {
  var oldHasSeenTour = this.hasSeenTour_;
  this.hasSeenTour_ = hasSeenTour;

  if (oldHasSeenTour != hasSeenTour) {
    this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
  }
}


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
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
};


/**
 * @param {!Array.<!CourseModel>} courses
 */
UserModel.prototype.removeCoursesFromPlayground = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    goog.array.remove(this.playground_, courses[i]);
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.PLAYGROUND_COURSES_REMOVED, courses));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
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
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
};


/**
 * @param {!Array.<!CourseModel>} courses
 */
UserModel.prototype.removeCoursesFromSchedule = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    goog.array.remove(this.schedule_, courses[i]);
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.SCHEDULE_COURSES_REMOVED, courses));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
};


/**
 * @param {!Array.<!CourseModel>} coursesToRemove To be removed from schedule
 * @param {!Array.<!CourseModel>} coursesToAdd To be added to schedule
 */
UserModel.prototype.updateSchedule = function(coursesToRemove, coursesToAdd) {
  // Remove the courses.
  for (var i = 0; i < coursesToRemove.length; i++) {
    goog.array.remove(this.schedule_, coursesToRemove[i]);
  }

  // Add the courses.
  for (var i = 0; i < coursesToAdd.length; i++) {
    if (!goog.array.contains(this.schedule_, coursesToAdd[i])) {
      goog.array.insert(this.schedule_, coursesToAdd[i]);
    }
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.SCHEDULE_COURSES_REMOVED, coursesToRemove));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.SCHEDULE_COURSES_ADDED, coursesToAdd));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
};


/**
 * Atomically migrates courses from the schedule to the playground in a way that triggers only one
 * modification event.
 * @param {!Array.<!CourseModel>} srcCourses To be removed from schedule
 * @param {!Array.<!CourseModel>} destCourses To be added to playground
 */
UserModel.prototype.moveCoursesFromScheduleToPlayground = function(srcCourses, destCourses) {
  // Remove the courses from the schedule.
  for (var i = 0; i < srcCourses.length; i++) {
    goog.array.remove(this.schedule_, srcCourses[i]);
  }

  // Add the courses to the playground.
  for (var i = 0; i < destCourses.length; i++) {
    if (!goog.array.contains(this.playground_, destCourses[i])) {
      goog.array.insert(this.playground_, destCourses[i]);
    }
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.SCHEDULE_COURSES_REMOVED, srcCourses));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.PLAYGROUND_COURSES_ADDED, destCourses));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
};


/**
 * Atomically migrates courses from the playground to the schedule in a way that triggers only one
 * modification event.
 * @param {!Array.<!CourseModel>} srcCourses To be removed from playground
 * @param {!Array.<!CourseModel>} destCourses To be added to schedule
 */
UserModel.prototype.moveCoursesFromPlaygroundToSchedule = function(srcCourses, destCourses) {
  // Remove the courses from the playground.
  for (var i = 0; i < srcCourses.length; i++) {
    goog.array.remove(this.playground_, srcCourses[i]);
  }

  // Add the courses to the schedule.
  for (var i = 0; i < destCourses.length; i++) {
    if (!goog.array.contains(this.schedule_, destCourses[i])) {
      goog.array.insert(this.schedule_, destCourses[i]);
    }
  }

  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.PLAYGROUND_COURSES_REMOVED, srcCourses));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.SCHEDULE_COURSES_ADDED, destCourses));
  this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
};


/**
 * @return {!Array.<!CourseModel>}
 */
UserModel.prototype.getCoursesInSchedule = function() {
  return this.schedule_;
};


});  // goog.scope
