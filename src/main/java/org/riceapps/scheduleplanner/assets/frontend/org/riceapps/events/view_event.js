/**
 * A custom event fired by various actions on an org.riceapps.views.View.
 */

goog.provide('org.riceapps.events.ViewEvent');
goog.provide('org.riceapps.events.ViewEvent.Type');

goog.require('goog.events.Event');

goog.scope(function() {



/**
 * @param {ViewEvent.Type} type
 * @extends {goog.events.Event}
 * @constructor
 */
org.riceapps.events.ViewEvent = function(type) {
  goog.base(this, type);
};
goog.inherits(org.riceapps.events.ViewEvent,
              goog.events.Event);
var ViewEvent = org.riceapps.events.ViewEvent;


/** @enum {string} */
ViewEvent.Type = {
  CHILD_ADDED: 'child_added',
  CHILD_REMOVED: 'child_removed'
};


});  // goog.scope
