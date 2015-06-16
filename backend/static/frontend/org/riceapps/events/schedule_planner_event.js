/**
 * A custom event fired by various actions on various components of the schedule planner application.
 */

goog.provide('org.riceapps.events.SchedulePlannerEvent');

goog.require('goog.events.Event');

goog.scope(function() {



/**
 * @param {!SchedulePlannerEvent.Type} type
 * @extends {goog.events.Event}
 * @constructor
 */
org.riceapps.events.SchedulePlannerEvent = function(type) {
  goog.base(this, type);

  /** @type {!Array.<!org.riceapps.views.AbstractCourseView>} */
  this.courses = [];

  /** @type {!Array.<!org.riceapps.models.CourseModel>} */
  this.models = [];

  /** @type {org.riceapps.models.CourseModel} */
  this.model = null;

  /** @type {string} */
  this.query = '';

  /** @type {?org.riceapps.models.CourseModel.Filter} */
  this.filters = null;
};
goog.inherits(org.riceapps.events.SchedulePlannerEvent,
              goog.events.Event);
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;




/**
 * NOTE: Comments define which properties must be set for which event type.
 * TODO: Enforce the property requirements in assertions.
 * @enum {string}
 */
SchedulePlannerEvent.Type = {
  UPDATE_SEARCH: 'sp_update_search', // filters, query
  CRN_CLICK: 'sp_crn_click',
  AGREE_DISCLAIMER: 'sp_disclaimer_agree',
  AGREE_VERSION: 'sp_agree_version',
  AGREE_GUEST: 'sp_agree_guest',
  EXIT_TOUR: 'sp_tour_exit',
  CLEAR_PLAYGROUND_CLICK: 'sp_clear_playground_click',
  SHOW_COURSE_DETAILS: 'sp_show_course_details', // model
  SHOW_COURSE_EVALS: 'sp_show_course_evals', // model
  REMOVE_COURSE: 'sp_remove_course', // model
  MOVE_TO_PLAYGROUND: 'sp_move_to_playground', // model
  MOVE_TO_CALENDAR: 'sp_move_to_calendar', // model
  ADD_GUIDE_VIEWS: 'sp_add_guide_views' // courses
};

});  // goog.scope
