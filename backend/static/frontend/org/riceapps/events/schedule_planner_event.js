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

  /** @type {string} */
  this.query = '';

  /** @type {?org.riceapps.models.CourseModel.Filter} */
  this.filters = null;
};
goog.inherits(org.riceapps.events.SchedulePlannerEvent,
              goog.events.Event);
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;




/**
 * @enum {string}
 */
SchedulePlannerEvent.Type = {
  ADD_GUIDE_VIEWS: 'sp_add_guide_views',
  UPDATE_SEARCH: 'sp_update_search',
  CRN_CLICK: 'sp_crn_click',
  CLEAR_PLAYGROUND_CLICK: 'sp_clear_playground_click'
};

});  // goog.scope
