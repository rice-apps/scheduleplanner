goog.provide('org.riceapps.events.SchedulePlannerEvent');

goog.require('goog.events.Event');

goog.scope(function() {



/**
 * @param {SchedulePlannerEvent.Type}
 * @extends {goog.events.Event}
 * @constructor
 */
org.riceapps.events.SchedulePlannerEvent = function(type) {
  goog.base(this, type);

  /** @type {!Array.<!org.riceapps.views.AbstractCourseView>} */
  this.courses = [];

  /** @type {!Array.<!org.riceapps.models.CourseModel} */
  this.models = [];

  /** @type {string} */
  this.query = '';
};
goog.inherits(org.riceapps.events.SchedulePlannerEvent,
              goog.events.Event);
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;


/**
 * @const {string}
 */
SchedulePlannerEvent.Type = {
  ADD_GUIDE_VIEWS: 'sp_add_guide_views',
  UPDATE_SEARCH: 'sp_update_search'
};

});  // goog.scope
