/**
 * A generic controller that all other controllers inherit from.
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.controllers.Controller');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.JSObject}
 */
org.riceapps.scheduleplanner.controllers.Controller = function() {
	this.superConstructor();
	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.controllers.Controller,
	           org.riceapps.scheduleplanner.JSObject);
var Controller = org.riceapps.scheduleplanner.controllers.Controller;

});