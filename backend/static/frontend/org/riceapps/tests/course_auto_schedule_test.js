/**
 * Proof of concept that takes a group of courses (e.g. PHYS 101, COMP 140, PSYC 101) and returns
 * all possible schedulings of those courses without conflicts, rendering each possible scheduling
 * in a CalendarView for the user to see.
 *
 * NOTE: This test must be served through the backend:
 * http://localhost/static/frontend/org/riceapps/tests/course_auto_schedule_test.html
 */

goog.provide('org.riceapps.tests.CourseAutoScheduleTest');

goog.require('goog.array');
goog.require('goog.style');
goog.require('org.riceapps.controllers.Controller');
goog.require('org.riceapps.controllers.SchedulePlannerXhrController');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.models.CoursesModel');
goog.require('org.riceapps.util.CourseConflictDetector');
goog.require('org.riceapps.views.CalendarView');
goog.require('org.riceapps.views.CourseCalendarView');

goog.scope(function() {



/**
 * @extends {org.riceapps.controllers.Controller}
 * @constructor
 */
org.riceapps.tests.CourseAutoScheduleTest = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.tests.CourseAutoScheduleTest,
              org.riceapps.controllers.Controller);
var CourseAutoScheduleTest = org.riceapps.tests.CourseAutoScheduleTest;


/**
 * Runs the test.
 */
CourseAutoScheduleTest.prototype.start = function() {
  window.console.log('CourseAutoScheduleTest.start');
  var xhrController = new org.riceapps.controllers.SchedulePlannerXhrController();
  xhrController.getAllCourses('../../../../../cache/courses.json').then(goog.bind(this.whenLoaded_, this));
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 * @return {!Array.<!Array.<!org.riceapps.models.CourseModel>>}
 */
CourseAutoScheduleTest.prototype.findAllSchedules = function(courses) {
  var detector = new org.riceapps.util.CourseConflictDetector();

  // Sort such that courses with fewer sections come first.
  courses.sort(function(a, b) {
    return b.getAllSections().length - a.getAllSections().length;
  });

  // Define a recursive function to enumerate possibilities (brute-force).
  var traverse = function(detector, schedules, courses, accumulator, i) {
    if (i == courses.length) {
      if (!detector.hasConflicts(accumulator)) {
        schedules.push(goog.array.clone(accumulator));
      }

      return;
    }

    var possibilities = courses[i].getAllSections();

    for (var j = 0; j < possibilities.length; j++) {
      goog.array.insert(accumulator, possibilities[j]);
      traverse(detector, schedules, courses, accumulator, i + 1);
      goog.array.remove(accumulator, possibilities[j]);
    }
  };

  var validSchedules = [];
  traverse(detector, validSchedules, courses, [], 0);
  return validSchedules;
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
CourseAutoScheduleTest.prototype.renderSchedule = function(courses) {
  var calendar = new org.riceapps.views.CalendarView();
  calendar.render(document.body);
  calendar.relayout();
  window['debugCalendar'] = calendar;

  goog.style.setStyle(calendar.getElement(), {
    'width': '1000px',
    'display': 'block'
  });

  for (var i = 0; i < courses.length; i++) {
    var view = new org.riceapps.views.CourseCalendarView(courses[i]);
    view.setDraggable(false);
    view.setContextMenuEnabled(false);
    calendar.addChild(view, true);
  }

  goog.style.setStyle(calendar.getElement(), {
    //'transform': 'scale(0.5, 0.5)',
    'transform-origin': '0 0',
    'box-shadow': '0px 0px 50px #000',
    'z-index': '10'
  });
};


/**
 * @param {!org.riceapps.models.CoursesModel} catalog
 * @private
 */
CourseAutoScheduleTest.prototype.whenLoaded_ = function(catalog) {
  window.console.log('CourseAutoScheduleTest.whenLoaded_');

  // Define the courses to be schedules (only need a single section for each course).
  var courses = [
    catalog.getCourseById(34803),
    catalog.getCourseById(35227)
  ];

  window.console.log('courses', courses);

  var possibleSchedules = this.findAllSchedules(courses);

  window.console.log('possibleSchedules', possibleSchedules);

  for (var i = 0; i < possibleSchedules.length; i++) {
    this.renderSchedule(possibleSchedules[i]);
  }
};

});  // goog.scope
