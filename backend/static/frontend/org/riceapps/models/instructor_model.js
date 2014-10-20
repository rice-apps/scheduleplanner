goog.provide('org.riceapps.models.InstructorModel');

goog.require('org.riceapps.models.Model');

goog.scope(function() {



/**
 * @extends {org.riceapps.models.Model}
 * @constructor
 */
org.riceapps.models.InstructorModel = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.models.InstructorModel,
              org.riceapps.models.Model);
var InstructorModel = org.riceapps.models.InstructorModel;


/**
 * @return {string}
 */
InstructorModel.prototype.getName = function() {
  return 'Instructor Name';
};


});  // goog.scope
