/**
 * Provides a view which represents a course as it appears inside of a org.riceapps.views.CourseListView.
 */
goog.provide('org.riceapps.views.ListCourseView');

goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.views.AbstractCourseView');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;


/**
 * @param {!org.riceapps.models.CourseModel} courseModel
 * @extends {org.riceapps.views.AbstractCourseView}
 * @constructor
 */
org.riceapps.views.ListCourseView = function(courseModel) {
  goog.base(this, courseModel);
  this.setDraggable(false);

  /** @private {Element} */
  this.courseTitle_ = null;

  /** @private {Element} */
  this.crn_ = null;

  /** @private {Element} */
  this.crnInput_ = null;
};
goog.inherits(org.riceapps.views.ListCourseView,
              org.riceapps.views.AbstractCourseView);
var ListCourseView = org.riceapps.views.ListCourseView;



/** @enum {string} */
ListCourseView.Theme = {
  BASE: 'course-view',
  CRN: 'course-view-crn'
};


/**
 * @override
 */
ListCourseView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var base = goog.dom.createDom(goog.dom.TagName.TR);
  var course = this.getCourseModel();
  var col;
  this.setElementInternal(base);

  /**
   * @param {string|!Array.<string>|!Element} content
   * @param {boolean=} opt_actionable
   * @return {!Element}
   */
  var addColumn = function(content, opt_actionable) {
    var column = goog.dom.createDom(goog.dom.TagName.TD);

    if (goog.isArray(content)) {
      for (var i = 0; i < content.length; i++) {
        var div = goog.dom.createDom(goog.dom.TagName.DIV);
        goog.dom.setTextContent(div, content[i]);
        goog.dom.appendChild(column, div);
      }
    } else if (goog.isString(content)) {
      goog.dom.setTextContent(column, content);
    } else if (goog.dom.isElement(content)) {
      goog.dom.appendChild(column, content);
    }

    goog.dom.appendChild(base, column);

    if (opt_actionable) {
      goog.style.setStyle(column, {'cursor': 'pointer'});
    }

    return column;
  };

  this.crnInput_ = goog.dom.createDom(goog.dom.TagName.INPUT, ListCourseView.Theme.CRN);
  this.crnInput_.readOnly = true;
  this.crnInput_.value = course.getCrn();
  this.crn_ = addColumn(this.crnInput_, true);

  this.courseTitle_ = addColumn(course.getTitle(), true);
  addColumn(course.getCreditsAsString());
  addColumn(course.getInstructorNames());
  addColumn(course.getMeetingTimesAsString());
  addColumn(course.getDistributionTypeAsString());
  addColumn(course.getRestrictions());
  addColumn(course.getTotalEnrollmentAsString());
  addColumn(course.getTotalWaitlistedAsString());
};


/**
 * @override
 */
ListCourseView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(this.courseTitle_, goog.events.EventType.CLICK, this.handleCourseTitleClick_).
    listen(this.crn_, goog.events.EventType.CLICK, this.handleCrnClick_);
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ListCourseView.prototype.handleCrnClick_ = function(event) {
  this.crnInput_.setSelectionRange(0, this.crnInput_.value.length);
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ListCourseView.prototype.handleCourseTitleClick_ = function(event) {
  var newEvent = new SchedulePlannerEvent(SchedulePlannerEvent.Type.SHOW_COURSE_DETAILS);
  newEvent.model = this.getCourseModel();
  this.dispatchEvent(newEvent);
};


/**
 * @override
 */
ListCourseView.prototype.isInList = function() {
  return true;
};


/**
 * @override
 */
ListCourseView.prototype.shouldShowInfoOnClick = function() {
  return false;
};

}); // goog.scope
