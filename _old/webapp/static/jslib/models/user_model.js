/**
 * A model for communicating with the application database.
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.models.UserModel');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.models.Model}
 */
org.riceapps.scheduleplanner.models.UserModel = function() {
	this.superConstructor();
	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.models.UserModel,
	           org.riceapps.scheduleplanner.models.Model);
var UserModel = org.riceapps.scheduleplanner.models.UserModel;

/** @enum {string} */
UserModel.Event = {
	SCHEDULE_LOADED : 'scheduleLoaded',
	PLAYGROUND_LOADED : 'playgroundLoaded',
	COURSE_LOADED : 'courseLoaded'
};

UserModel.prototype.getSchedule = function() {
	var data = [3];
	this.notify(UserModel.Event.SCHEDULE_LOADED, data);
};

UserModel.prototype.getPlayground = function() {
	var data = [1,2];
	this.notify(UserModel.Event.PLAYGROUND_LOADED, data);
};

UserModel.prototype.getCourse = function(courseid) {
	var data = {
		1 : {
			"title" : "COLL 144: Web Application Development",
			"subject" : "COLL",
			"course_number" : "144",
			"times" : [
				{
					"day" : 0,
					"start" : 9,
					"end" : 10.9
				},
				{
					"day" : 2,
					"start" : 9,
					"end" : 10.9
				},
				{
					"day" : 4,
					"start" : 9,
					"end" : 10.9
				},
				{
					"day" : 2,
					"start" : 13,
					"end" : 14.5
				}
			]
		},
		2 : {
			"title" : "COLL 145",
			"subject" : "COLL",
			"course_number" : "145",
			"times" : [
				{
					"day" : 1,
					"start" : 10,
					"end" : 11
				},
				{
					"day" : 3,
					"start" : 10,
					"end" : 11
				}
			]
		},
		3 : {
			"title" : "COLL 146",
			"subject" : "COLL",
			"course_number" : "146",
			"times" : [
				{
					"day" : 1,
					"start" : 10.5,
					"end" : 12
				},
				{
					"day" : 3,
					"start" : 10,
					"end" : 11
				}
			]
		}
	};
	this.notify(UserModel.Event.COURSE_LOADED, courseid, data[courseid]);
};

UserModel.prototype.getCourses = function(courses) {
	for(var i = 0; i < courses.length; i++) {
		this.getCourse(courses[i]);
	}
};

UserModel.prototype.searchCourses = function(query) {

};

UserModel.prototype.addToSchedule = function(courseid) {

};

UserModel.prototype.removeFromSchedule = function(courseid) {

};

UserModel.prototype.addToPlayground = function(courseid) {

};

UserModel.prototype.removeFromPlayground = function(courseid) {

};

});