/**
 * A generic model that all other models inherit from.
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.models.Model');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.JSObject}
 */
org.riceapps.scheduleplanner.models.Model = function() {
	this.superConstructor();
	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.models.Model,
	           org.riceapps.scheduleplanner.JSObject);
var Model = org.riceapps.scheduleplanner.models.Model;

});