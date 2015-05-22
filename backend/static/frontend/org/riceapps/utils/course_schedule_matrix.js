/**
 * Provides a method for detecting scheduling conflicts amongst a set of courses efficiently.
 *
 * Usage:
 * conflictDetector = new CourseScheduleMatrix();
 * conflictDetector.setCourses(courseModels);
 * if (conflictDetector.hasConflictsWith(courseModel)) { ... } else { ... }
 */

goog.provide('org.riceapps.util.CourseScheduleMatrix');

goog.require('goog.array');

goog.scope(function() {



/**
 * @constructor
 */
org.riceapps.util.CourseScheduleMatrix = function() {
  /** @private {!Array.<!org.riceapps.models.CourseModel>} */
  this.courses_ = [];

  /** @private {Object.<number, !Object.<number, boolean>>} */
  this.matrix_ = null;
};
var CourseScheduleMatrix = org.riceapps.util.CourseScheduleMatrix;



/**
 * Fraction of hour to which matrix should check for collisions.
 * e.g. value of 4 indicates 1/4 of an hour, or 15 minutes
 * @type {number}
 */
CourseScheduleMatrix.GRANULARITY = 4;


/**
 * @private
 */
CourseScheduleMatrix.prototype.rebuildMatrix_ = function() {
  // Create an empty matrix.
  this.matrix_ = {};

  for (var day = 0; day < 7; day++) {
    this.matrix_[day] = {};

    for (var hour = 0; hour < 24 * CourseScheduleMatrix.GRANULARITY; hour++) {
      this.matrix_[day][hour] = false;
    }
  }

  // Fill in slots in the matrix.
  for (var i = 0; i < this.courses_.length; i++) {
    var times = this.courses_[i].getMeetingTimes();
    for (var j = 0; j < times.length; j++) {
      for (var hour = Math.floor(times[j]['start'] * CourseScheduleMatrix.GRANULARITY);
           hour < Math.ceil(times[j]['end'] * CourseScheduleMatrix.GRANULARITY);
           hour += 1) {
        this.matrix_[times[j]['day']][hour] = true;
      }
    }
  }
};


/**
 * Adds courses into the scheduling matrix.
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
CourseScheduleMatrix.prototype.setCourses = function(courses) {
  this.courses_ = [];

  for (var i = 0; i < courses.length; i++) {
    goog.array.insert(this.courses_, courses[i]);
  }

  this.rebuildMatrix_();
};


/**
 * Returns whether a given course conflicts (in terms of time) with any of the courses in the matrix.
 * @param {!org.riceapps.models.CourseModel} course
 * @return {boolean}
 */
CourseScheduleMatrix.prototype.hasConflictWith = function(course) {
  var times = course.getMeetingTimes();

  for (var j = 0; j < times.length; j++) {
    for (var hour = Math.floor(times[j]['start'] * CourseScheduleMatrix.GRANULARITY);
         hour < Math.ceil(times[j]['end'] * CourseScheduleMatrix.GRANULARITY);
         hour += 1) {
      if (this.matrix_[times[j]['day']][hour]) {
        return true;
      }
    }
  }

  return false;
};

});  // goog.scope
