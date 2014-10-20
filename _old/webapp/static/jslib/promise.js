/**
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.Promise');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.JSObject}
 */
org.riceapps.scheduleplanner.Promise = function() {
	this.superConstructor();

	/** @private {Promise} */
	this.previousPromise_ = null;

	/** @private {Promise} */
	this.nextPromise_ = null;

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.Promise,
	           org.riceapps.scheduleplanner.JSObject);
var Promise = org.riceapps.scheduleplanner.Promise;a

/**
 * Schedules an action (or set of actions) to be done when this promise is resolved.
 * This method is chainable.
 * @param {Function|Array.<Function>} target
 */
Promise.prototype.then = function(target) {

};

/**
 * Schedules an action (or set of actions) to be done when this promise is resolved.
 * @param {Function|Array.<Function>} target
 */
Promise.prototype.done = function(target) {

};

/**
 * Returns whether or not the promise has been resolved.
 */
Promise.prototype.isResolved = function() {

};

});
