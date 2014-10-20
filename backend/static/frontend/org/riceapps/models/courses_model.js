goog.provide('org.riceapps.models.CoursesModel');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.structs.Map');
goog.require('org.riceapps.models.Model');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.protocol.Messages');

goog.scope(function() {
var CourseModel = org.riceapps.models.CourseModel;


/**
 * @param {?org.riceapps.protocol.Messages.Courses=} opt_data
 * @extends {org.riceapps.models.Model}
 * @constructor
 */
org.riceapps.models.CoursesModel = function(opt_data) {
  goog.base(this);

  /** @private {!goog.structs.Map.<number, !CourseModel>} */
  this.courses_ = new goog.structs.Map();

  if (opt_data) {
    for (var i = 0; i < opt_data['courses'].length; i++) {
      var course = opt_data['courses'][i];
      this.courses_.set(course['courseId'], new CourseModel(course, this));
    }
  }

};
goog.inherits(org.riceapps.models.CoursesModel,
              org.riceapps.models.Model);
var CoursesModel = org.riceapps.models.CoursesModel;


/**
 * @param {number} id
 * @return {org.riceapps.models.CourseModel}
 */
CoursesModel.prototype.getCourseById = function(id) {
  return this.courses_.get(id, null);
};


/**
 * Returns all sections of the provided course (including the provided course itself).
 * @param {!org.riceapps.models.CourseModel} course
 * @return {!Array.<org.riceapps.models.CourseModel}
 */
CoursesModel.prototype.getAllSections = function(course) {
  var keys = this.courses_.getKeys();
  var category = course.getCourseCategory();
  var sections = [];

  for (var i = 0; i < keys.length; i++) {
    var otherCourse = this.courses_.get(keys[i]);
    if (otherCourse.getCourseCategory() == category) {
      sections.push(otherCourse);
    }
  }

  return sections;
};


/**
 * @param {string} query
 * @param {number=} opt_limit
 * @param {org.riceapps.models.UserModel=} opt_userModel
 * @return {!Array.<org.riceapps.models.CourseModel>}
 */
CoursesModel.prototype.getCoursesByQuery = function(query, opt_userModel, opt_limit) {
  if (query.length == 0) {
    return [];
  }

  var limit = opt_limit || 100;
  var results = [];
  var keys = this.courses_.getKeys();
  var used = new goog.structs.Map();

  for (var i = 0; i < keys.length; i++) {
    var course = this.courses_.get(keys[i]);

    if (goog.string.caseInsensitiveContains(course.getTitle(), query)) {
      var category = course.getCourseCategory();
      if (used.get(category, false) == true) {
        continue;
      }

      if (!opt_userModel) {
        results.push(course);
        used.set(category, true);
      } else if (opt_userModel) {
        if (this.userModelContainsCourse_(opt_userModel, course)) {
          continue;
        }

        results.push(course);
        used.set(category, true);
      }

      if (results.length > limit) {
        break;
      }
    }
  }

  return results;
};


/**
 * @param {!org.riceapps.models.UserModel} userModel
 * @param {!org.riceapps.models.CourseModel} course
 * @return {boolean}
 * @private
 */
CoursesModel.prototype.userModelContainsCourse_ = function(userModel, course) {
  var playground = userModel.getCoursesInPlayground();
  var schedule = userModel.getCoursesInSchedule();
  var category = course.getCourseCategory();

  for (var i = 0; i < playground.length; i++) {
    if (playground[i].getCourseCategory() == category) {
      return true;
    }
  }

  for (var i = 0; i < schedule.length; i++) {
    if (schedule[i].getCourseCategory() == category) {
      return true;
    }
  }

  return false;
};

});  // goog.scope
