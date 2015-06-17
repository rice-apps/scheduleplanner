/**
 * Provides a model which represents a user of the application.
 * NOTE: SchedulePlannerController listens for changes to the user model and automatically pushes those changes to the back-end.
 */

goog.provide('org.riceapps.models.UserModel');

goog.require('goog.array');
goog.require('org.riceapps.events.UserModelEvent');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.models.Model');
goog.require('org.riceapps.protocol.Messages');

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

  /** @private {number} */
  this.lastSeenVersion_ = data['lastSeenVersion'];

  /** @private {boolean} */
  this.hasAgreedToDisclaimer_ = data['hasAgreedToDisclaimer'];

  // NOTE: Export the user model for the developer console. DO NOT SUBMIT!
  window['userModel'] = this;
};
goog.inherits(org.riceapps.models.UserModel,
              org.riceapps.models.Model);
var UserModel = org.riceapps.models.UserModel;


/**
 * A number used to indicate an invalid user id.
 * @const {number}
 */
UserModel.INVALID_USER_ID = -1;


/**
 * Initializes the user model given a course catalog; neccesary because the back-end passes course ids but the
 * user model needs to convert them to instances of org.riceapps.models.CourseModel.
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
};


/**
 * Returns whether or not a user is logged in.
 * @return {boolean}
 */
UserModel.prototype.isLoggedIn = function() {
  return this.userId_ != UserModel.INVALID_USER_ID;
};


/**
 * Returns a unique integer identifying the user.
 * @return {number}
 */
UserModel.prototype.getUserId = function() {
  return this.userId_;
};


/**
 * Returns the XSRF token required to modify the user through back-end requests.
 * @return {string}
 */
UserModel.prototype.getXsrfToken = function() {
  return this.xsrfToken_;
};


/**
 * Returns a unique string identifying the user.
 * @return {string}
 */
UserModel.prototype.getUserName = function() {
  if (this.userId_ == UserModel.INVALID_USER_ID) {
    return 'Guest';
  }

  return this.userName_;
};


/**
 * Returns whether or not the user has seen the tour before.
 * @return {boolean}
 */
UserModel.prototype.hasSeenTour = function() {
  return this.hasSeenTour_;
};


/**
 * Sets whether or not the user has seen the tour before.
 * @param {boolean} hasSeenTour
 */
UserModel.prototype.setHasSeenTour = function(hasSeenTour) {
  var oldHasSeenTour = this.hasSeenTour_;
  this.hasSeenTour_ = hasSeenTour;

  if (oldHasSeenTour != hasSeenTour) {
    this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
  }
};


/**
 * Returns the version of the application that was present the last time the user visited the application.
 * @return {number}
 */
UserModel.prototype.getLastSeenVersion = function() {
  return this.lastSeenVersion_;
};


/**
 * Sets the last version of the application that the user has seen.
 * @param {number} lastSeenVersion
 */
UserModel.prototype.setLastSeenVersion = function(lastSeenVersion) {
  var oldLastSeenVersion = this.lastSeenVersion_;
  this.lastSeenVersion_ = lastSeenVersion;

  if (oldLastSeenVersion != lastSeenVersion) {
    this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
  }
};


/**
 * Returns whether or not the user has agreed to the terms and conditions.
 * @return {boolean}
 */
UserModel.prototype.hasAgreedToDisclaimer = function() {
  return this.hasAgreedToDisclaimer_;
};


/**
 * Sets whether or not the user has agreed to the terms and conditions.
 * @param {boolean} hasAgreedToDisclaimer
 */
UserModel.prototype.setHasAgreedToDisclaimer = function(hasAgreedToDisclaimer) {
  var oldHasAgreedToDisclaimer = this.hasAgreedToDisclaimer_;
  this.hasAgreedToDisclaimer_ = hasAgreedToDisclaimer;

  if (oldHasAgreedToDisclaimer != hasAgreedToDisclaimer) {
    this.dispatchEvent(new UserModelEvent(UserModelEvent.Type.USER_MODEL_CHANGED));
  }
};


/**
 * Adds courses to the playground (staging area).
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
 * Removes courses from the playground (staging area).
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
 * Returns the courses in the playground (staging area).
 * @return {!Array.<!CourseModel>}
 */
UserModel.prototype.getCoursesInPlayground = function() {
  return this.playground_;
};


/**
 * Adds courses to the schedule (calendar).
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
 * Removes courses from the schedule (calendar).
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
 * Atomically updates the courses present on the schedule in a way that triggers only one modification event.
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
 * Returns all of the courses in the schedule (calendar).
 * @return {!Array.<!CourseModel>}
 */
UserModel.prototype.getCoursesInSchedule = function() {
  return this.schedule_;
};


/**
 * Returns the number of credit hours present on the calendar. Returns total hours if no parameter provided, or hours in a
 * particular distribution group if a parameter is provided.
 * @param {number=} opt_distributionGroup
 * @return {number}
 */
UserModel.prototype.getCreditHoursInSchedule = function(opt_distributionGroup) {
  var dg = opt_distributionGroup || 0;
  var hours = 0;

  for (var i = 0; i < this.schedule_.length; i++) {
    var course = this.schedule_[i];

    if (dg == 0) {
      hours += course.getCredits();
    } else if (dg == 1) {
      hours += course.getDistributionOneCredits();
    } else if (dg == 2) {
      hours += course.getDistributionTwoCredits();
    } else if (dg == 3) {
      hours += course.getDistributionThreeCredits();
    }
  }

  return hours;
};

});  // goog.scope
