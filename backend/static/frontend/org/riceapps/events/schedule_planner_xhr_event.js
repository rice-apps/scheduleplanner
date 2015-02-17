goog.provide('org.riceapps.events.SchedulePlannerXhrEvent');

goog.require('goog.events.Event');

goog.scope(function() {



/**
 * @param {!SchedulePlannerXhrEvent.Type} type
 * @param {!SchedulePlannerXhrEvent.ErrorType=} opt_errorType
 * @extends {goog.events.Event}
 * @constructor
 */
org.riceapps.events.SchedulePlannerXhrEvent = function(type, opt_errorType) {
  goog.base(this, type);

  /** @private {!SchedulePlannerXhrEvent.ErrorType} */
  this.errorType_ = opt_errorType || SchedulePlannerXhrEvent.ErrorType.NONE;
};
goog.inherits(org.riceapps.events.SchedulePlannerXhrEvent,
              goog.events.Event);
var SchedulePlannerXhrEvent = org.riceapps.events.SchedulePlannerXhrEvent;


/**
 * @enum {string}
 */
SchedulePlannerXhrEvent.Type = {
  XHR_FAILED: 'schedule_planner_xhr_event_failed'
};


/**
 * @enum {string}
 */
SchedulePlannerXhrEvent.ErrorType = {
  NONE: 'none',
  SESSION_EXPIRED: 'session_expired',
  XSRF_EXPIRED: 'xsrf_expired',
  PARSE_ERROR: 'parse_error',
  NETWORK_FAILURE: 'network_failure',
  ACCESS_VIOLATION: 'access_violation',
  UNKNOWN: 'unknown'
};


/**
 * @return {!SchedulePlannerXhrEvent.ErrorType}
 */
SchedulePlannerXhrEvent.prototype.getErrorType = function() {
  return this.errorType_;
};

});  // goog.scope
