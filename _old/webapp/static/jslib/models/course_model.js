/**
 * An object representation of an individual course.
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.models.CourseModel');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.models.Model}
 */
org.riceapps.scheduleplanner.models.CourseModel = function() {
	this.superConstructor();


	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.models.CourseModel,
               org.riceapps.scheduleplanner.models.Model);
var CourseModel = org.riceapps.scheduleplanner.models.CourseModel;

/**
 * Returns a unique integer identifier for this course.
 * @return {number}
 */
CourseModel.prototype.getId = function() {

};

/**
 * Returns the title of the course.
 * @return {string}
 */
CourseModel.prototype.getTitle = function() {

};

/**
 * Returns all of the other sections of this course.
 * @return {Array.<CourseModel>}
 */
CourseModel.prototype.getSections = function() {

};

/**
 * Returns all of the times at which this course is offered.
 * @return {Array.<Object>}
 */
CourseModel.prototype.getTimes = function() {

};

/**
 * Returns an array of unique integers representing the instructors.
 * @return {Array.<number>}
 */
CourseModel.prototype.getInstructorIds = function() {

};

/**
 * Returns an object map of this course's instructor's names which instructor ids as keys.
 * @return {Object.<number, String>}
 */
CourseModel.prototype.getInstructors = function() {

};

});
