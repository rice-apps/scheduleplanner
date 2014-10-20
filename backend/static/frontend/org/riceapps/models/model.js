goog.provide('org.riceapps.models.Model');

goog.require('goog.events.EventTarget');

goog.scope(function() {



/**
 * @extends {goog.events.EventTarget}
 * @constructor
 */
org.riceapps.models.Model = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.models.Model,
              goog.events.EventTarget);
var Model = org.riceapps.models.Model;

});  // goog.scope
