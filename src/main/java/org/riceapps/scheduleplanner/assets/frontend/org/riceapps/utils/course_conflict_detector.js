/**
 * Provides a method for detecting scheduling conflicts amongst a set of courses efficiently.
 */

goog.provide('org.riceapps.util.CourseConflictDetector');

goog.require('goog.array');

goog.scope(function() {


/**
 * @constructor
 */
org.riceapps.util.CourseConflictDetector = function() {};
var CourseConflictDetector = org.riceapps.util.CourseConflictDetector;



/**
 * Fraction of hour to which matrix should check for collisions.
 * e.g. value of 4 indicates 1/4 of an hour, or 15 minutes
 * @type {number}
 */
CourseConflictDetector.GRANULARITY = 4;


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 * @return {boolean}
 */
CourseConflictDetector.prototype.hasConflicts = function(courses) {
  // Create an empty matrix.
  var matrix = {};

  for (var day = 0; day < 7; day++) {
    matrix[day] = {};

    for (var hour = 0; hour < 24 * CourseConflictDetector.GRANULARITY; hour++) {
      matrix[day][hour] = false;
    }
  }

  // Fill in slots in the matrix.
  for (var i = 0; i < courses.length; i++) {
    var times = courses[i].getMeetingTimes();
    for (var j = 0; j < times.length; j++) {
      for (var hour = Math.floor(times[j]['start'] * CourseConflictDetector.GRANULARITY);
           hour < Math.ceil(times[j]['end'] * CourseConflictDetector.GRANULARITY);
           hour += 1) {
        if (matrix[times[j]['day']][hour] == true) {
          return true;
        }

        matrix[times[j]['day']][hour] = true;
      }
    }
  }

  return false;
};

});  // goog.scope
