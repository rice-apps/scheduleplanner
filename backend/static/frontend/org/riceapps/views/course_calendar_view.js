goog.provide('org.riceapps.views.CourseCalendarView');

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
 * @implements {org.riceapps.layouts.CalendarLayout.Item}
 * @extends {org.riceapps.views.AbstractCourseView}
 * @constructor
 */
org.riceapps.views.CourseCalendarView = function(courseModel) {
  goog.base(this, courseModel);

  /** @private {!Array.<!Element>} */
  this.boxes_ = [];
};
goog.inherits(org.riceapps.views.CourseCalendarView,
              org.riceapps.views.AbstractCourseView);
var CourseCalendarView = org.riceapps.views.CourseCalendarView;


/** @enum {string} */
CourseCalendarView.Theme = {
  'CONTAINER': 'course-calendar-view-container',
  'BASE': 'course-calendar-view',
  'TOOLTIP': 'course-calendar-view-tooltip'
};


/**
 * @const {goog.math.Rect}
 */
CourseCalendarView.RENDER_ADJUST = new goog.math.Rect(0, 0, 10, 10);


/**
 * @override
 */
CourseCalendarView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CourseCalendarView.Theme.CONTAINER);
};


/**
 * @override
 */
CourseCalendarView.prototype.getDragTooltip = function() {
  var element = goog.dom.createDom(goog.dom.TagName.DIV, CourseCalendarView.Theme.TOOLTIP);
  goog.dom.setTextContent(element, this.getCourseModel().getTitle());
  goog.dom.appendChild(document.body, element);
  var tooltip = this.makeTooltipFromElement(element);
  goog.dom.removeNode(element);
  return tooltip;
};


/**
 * @override
 */
CourseCalendarView.prototype.shouldHideElementOnDrag = function() {
  return true;
};


/**
 * @override
 */
CourseCalendarView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.removeBoxes_();
};


/**
 * @private
 */
CourseCalendarView.prototype.removeBoxes_ = function() {
  for (var i = 0; i < this.boxes_.length; i++) {
    goog.dom.removeNode(this.boxes_[i]);
  }

  this.boxes_ = [];
};


/**
 * @override
 */
CourseCalendarView.prototype.getChildInsertionIndex = function() {
  return this.getParent().indexOfChild(this) + 1;
};


/**
 * @override
 */
CourseCalendarView.prototype.getCalendarTimes = function() {
  if (this.isBeingDragged()) {
    return [];
  } else {
    return this.getCourseModel().getCalendarMeetingTimes();
  }
};


/**
 * @override
 */
CourseCalendarView.prototype.drawInRects = function(rects) {
  this.removeBoxes_();
  this.makeBoxesInRects_(rects);
};


/**
 * @param {!Array.<goog.math.Rect>} rects
 * @private
 */
CourseCalendarView.prototype.makeBoxesInRects_ = function(rects) {
  var times = this.getCalendarTimes();
  goog.asserts.assert(rects.length == times.length);

  for (var i = 0; i < times.length; i++) {
    var rect = rects[i];
    var numberOfDetails = Math.floor(rect.height / 22);

    var element = goog.dom.createDom(goog.dom.TagName.DIV, CourseCalendarView.Theme.BASE);
    goog.dom.setTextContent(element, this.getCourseModel().getTitle());
    goog.dom.appendChild(this.getElement(), element);

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

    DomUtils.applyRect(element, rect, CourseCalendarView.RENDER_ADJUST);
    this.boxes_.push(element);
  }
};

}); // goog.scope
