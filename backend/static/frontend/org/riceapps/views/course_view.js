goog.provide('org.riceapps.views.CourseView');

goog.require('goog.dom.classlist');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.views.AbstractCourseView');

goog.scope(function() {


/**
 * @param {!org.riceapps.models.CourseModel} courseModel
 * @extends {org.riceapps.views.AbstractCourseView}
 * @constructor
 */
org.riceapps.views.CourseView = function(courseModel) {
  goog.base(this, courseModel);
};
goog.inherits(org.riceapps.views.CourseView,
              org.riceapps.views.AbstractCourseView);
var CourseView = org.riceapps.views.CourseView;


/** @enum {string} */
CourseView.Theme = {
  'BASE': 'course-view'
};


/**
 * @override
 */
CourseView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CourseView.Theme.BASE);
  goog.dom.setTextContent(this.getElement(), this.getCourseModel().getTitle());
};

}); // goog.scope
