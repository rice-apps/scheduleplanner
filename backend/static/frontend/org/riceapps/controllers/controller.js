goog.provide('org.riceapps.controllers.Controller');

goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');

goog.scope(function() {



/**
 * @extends {goog.events.EventTarget}
 * @constructor
 */
org.riceapps.controllers.Controller = function() {
  goog.base(this);

  /** @private {!goog.events.EventHandler} */
  this.eventHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(org.riceapps.controllers.Controller,
              goog.events.EventTarget);
var Controller = org.riceapps.controllers.Controller;


/**
 * @return {!goog.events.EventHandler}
 */
Controller.prototype.getHandler = function() {
  return this.eventHandler_;
};

});  // goog.scope
