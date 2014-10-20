/**
 * A top-level object that everything inherits from.
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.JSObject');

jslib.scope(function(){

/**
 * @constructor
 */
org.riceapps.scheduleplanner.JSObject = function() {
	/** @private {!Object.<string, Array<!Object>>} */
	this.observers_ = {};

	return this;
};
var JSObject = org.riceapps.scheduleplanner.JSObject;

/**
 * Adds an observer.
 * @param {Object} object
 * @param {string} event
 * @param {Function} handler
 */
JSObject.prototype.addObserver = function(object, event, handler) {
	if(!(event in this.observers_))
		this.observers_[event] = [];

	this.observers_[event].push({
		callback: handler,
		target: object
	});
};

/**
 * Removes an observer.
 * @param {Object} object
 * @param {string} event
 */
JSObject.prototype.removeObserver = function(object, event) {
	if(!(event in this.observers_))
		return;

	for(var i = 0; i < this.observers[event].length; i++) {
		var subscriber = this.observers_[event][i];

		if(subscriber.target === object) {
			 this.observers_[event].splice(i, 1);
			 return;
		}
	}
};

/**
 * Notifies all observers that an event has occured.
 * @param {string} event
 * @param {...*} var_args
 */
JSObject.prototype.notify = function(event, var_args) {
	if(!(event in this.observers_))
		return;

	var ev = event;

	var args = arguments;
	args[0] = this;

	for(var i = 0; i < this.observers_[ev].length; i++) {
		var subscriber = this.observers_[ev][i];
		subscriber.callback.apply(subscriber.target, args);
	}
};

/**
 * Subscribes to updates for the given event and object.
 * @param {Object} object
 * @param {string} event
 * @param {Function} handler
 */
JSObject.prototype.subscribe = function(object, event, handler) {
	object.addObserver(this, event, handler);
};

/**
 * Unsubscribes from updates for the given event and object.
 * @param {Object} object
 * @param {string} event
 */
JSObject.prototype.unsubscribe = function(object, event) {
	object.removeObserver(this, event);
};

});