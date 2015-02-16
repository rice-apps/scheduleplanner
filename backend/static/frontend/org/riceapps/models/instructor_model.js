goog.provide('org.riceapps.models.InstructorModel');

goog.require('org.riceapps.models.Model');
goog.require('org.riceapps.protocol.Messages.Instructor');

goog.scope(function() {



/**
 * @param {!org.riceapps.protocol.Messages.Instructor} data
 * @extends {org.riceapps.models.Model}
 * @constructor
 */
org.riceapps.models.InstructorModel = function(data) {
  goog.base(this);

  /** @private {!org.riceapps.protocol.Messages.Instructor} */
  this.data_ = data;
};
goog.inherits(org.riceapps.models.InstructorModel,
              org.riceapps.models.Model);
var InstructorModel = org.riceapps.models.InstructorModel;


/**
 * @return {number}
 */
InstructorModel.prototype.getId = function() {
  return this.data_['instructorId'];
};


/**
 * @return {string}
 */
InstructorModel.prototype.getName = function() {
  return this.data_['instructorName'];
};


});  // goog.scope
