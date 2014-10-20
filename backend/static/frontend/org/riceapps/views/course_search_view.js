goog.provide('org.riceapps.views.CourseSearchView');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.math.Rect');
goog.require('org.riceapps.layouts.CalendarLayout.Item');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.utils.DomUtils');
goog.require('org.riceapps.views.AbstractCourseView');

goog.scope(function() {
var DomUtils = org.riceapps.utils.DomUtils;


/**
 * @param {!org.riceapps.models.CourseModel} courseModel
 * @extends {org.riceapps.views.AbstractCourseView}
 * @constructor
 */
org.riceapps.views.CourseSearchView = function(courseModel) {
  goog.base(this, courseModel);
};
goog.inherits(org.riceapps.views.CourseSearchView,
              org.riceapps.views.AbstractCourseView);
var CourseSearchView = org.riceapps.views.CourseSearchView;


/** @enum {string} */
CourseSearchView.Theme = {
  'BASE': 'course-search-view',
  'TOOLTIP': 'course-search-view-tooltip'
};


/**
 * @const {goog.math.Rect}
 */
CourseSearchView.RENDER_ADJUST = new goog.math.Rect(0, 0, 0, 0);


/**
 * @override
 */
CourseSearchView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CourseSearchView.Theme.BASE);
  goog.dom.setTextContent(this.getElement(), this.getCourseModel().getTitle());

  /*



    if (numberOfDetails > 1) {
      var div = goog.dom.createDom(goog.dom.TagName.DIV);
      goog.dom.setTextContent(div, times[i]['location']);
      goog.dom.appendChild(element, div);
    }

    if (numberOfDetails > 2) {
      var div = goog.dom.createDom(goog.dom.TagName.DIV);
      goog.dom.setTextContent(div, this.getCourseModel().getInstructor().getName());
      goog.dom.appendChild(element, div);
    }
  */
};


/**
 * @override
 */
CourseSearchView.prototype.getDragTooltip = function() {
  var element = goog.dom.createDom(goog.dom.TagName.DIV, CourseSearchView.Theme.TOOLTIP);
  goog.dom.setTextContent(element, this.getCourseModel().getTitle());
  goog.dom.appendChild(document.body, element);
  var tooltip = this.makeTooltipFromElement(element);
  goog.dom.removeNode(element);
  return tooltip;
};


/**
 * @override
 */
CourseSearchView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
};

}); // goog.scope
