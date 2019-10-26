/**
 * Provides an environment in which to test org.riceapps.fx.Animation.
 * NOTE: You can run the test by viewing animation_test.html after building deps.js by running build_dev.sh.
 */

goog.provide('org.riceapps.tests.CourseScheduleMatrixTest');

goog.require('org.riceapps.controllers.Controller');
goog.require('org.riceapps.controllers.SchedulePlannerXhrController');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.models.CoursesModel');
goog.require('org.riceapps.util.CourseScheduleMatrix');

goog.scope(function() {



/**
 * @extends {org.riceapps.controllers.Controller}
 * @constructor
 */
org.riceapps.tests.CourseScheduleMatrixTest = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.tests.CourseScheduleMatrixTest,
              org.riceapps.controllers.Controller);
var CourseScheduleMatrixTest = org.riceapps.tests.CourseScheduleMatrixTest;


/**
 * Runs the test.
 */
CourseScheduleMatrixTest.prototype.start = function() {
  window.console.log('CourseScheduleMatrixTest.start');
  var xhrController = new org.riceapps.controllers.SchedulePlannerXhrController();
  xhrController.getAllCourses('/api/courses').then(this.startInternal_);
};


/**
 * @param {!org.riceapps.models.CoursesModel} courses
 * @private
 */
CourseScheduleMatrixTest.prototype.startInternal_ = function(courses) {
  window.console.log('CourseScheduleMatrixTest.startInternal_');
  var matrix = new org.riceapps.util.CourseScheduleMatrix();
};

});  // goog.scope
