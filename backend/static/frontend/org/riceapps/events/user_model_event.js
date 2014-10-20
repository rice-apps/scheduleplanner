goog.provide('org.riceapps.events.UserModelEvent');
goog.provide('org.riceapps.events.UserModelEvent.Type');

goog.require('goog.events.Event');

goog.scope(function() {



/**
 * @param {UserModelEvent.Type} type
 * @param {Array.<org.riceapps.models.CourseModel>=} opt_models
 * @extends {goog.events.Event}
 * @constructor
 */
org.riceapps.events.UserModelEvent = function(type, opt_models) {
  goog.base(this, type);

  /** @type {!Array.<org.riceapps.models.CourseModel>} */
  this.courses = opt_models || [];
};
goog.inherits(org.riceapps.events.UserModelEvent,
              goog.events.Event);
var UserModelEvent = org.riceapps.events.UserModelEvent;


/** @enum {string} */
UserModelEvent.Type = {
  PLAYGROUND_COURSES_ADDED: 'ume_pg_course_add',
  PLAYGROUND_COURSES_REMOVED: 'ume_pg_course_rem',
  SCHEDULE_COURSES_ADDED: 'ume_sc_course_add',
  SCHEDULE_COURSES_REMOVED: 'ume_sc_course_rem'
};


});  // goog.scope
