goog.provide('org.riceapps.utils.CourseUtils');

goog.require('org.riceapps.models.CourseModel');

goog.scope(function() {
var CourseModel = org.riceapps.models.CourseModel;
var CourseUtils = org.riceapps.utils.CourseUtils;



/**
 * Returns whether or not the provided set of courses contains scheduling conflicts.
 * NOTE: haven't tested this yet.
 * @param {!Array.<!CourseModel>} courses
 * @return {boolean}
 */
CourseUtils.prototype.hasSchedulingConflicts = function(courses) {
  // Create matrix.
  var PRECISION = 4;
  var matrix = {};

  for (var day = 0; day < 7; day++) {
    matrix[day] = {};

    for (var hour = 0; hour < 24 * PRECISION; hour++) {
      matrix[day][hour] = false;
    }
  }

  // Start scheduling.
  for (var i = 0; i < courses.length; i++) {
      var times = courses[i].getMeetingTimes();
      for (var j = 0; j < times.length; j++) {
        var time = times[j];
        var day = time['day'];
        var start = time['start'];
        var end = time['end'];

        for (var hour = Math.floor(start * PRECISION);
             hour < Math.ceil(end * PRECISION);
             hour += 1) {
          if (matrix[day][hour] == true) {
            return false;
          }

          matrix[day][hour] = true;
        }
      }
  }

  return true;
};

});  // goog.scope

