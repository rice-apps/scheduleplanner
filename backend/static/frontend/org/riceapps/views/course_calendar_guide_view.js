/**
 * Provides a view which represents a course as it appears inside of a org.riceapps.views.CalendarView that can be dropped upon.
 */

goog.provide('org.riceapps.views.CourseCalendarGuideView');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.layouts.CalendarLayout.Item');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.utils.DomUtils');
goog.require('org.riceapps.views.CalendarView');
goog.require('org.riceapps.views.DraggableView');
goog.require('org.riceapps.views.DraggableView.DropTarget');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var DomUtils = org.riceapps.utils.DomUtils;
var DraggableView = org.riceapps.views.DraggableView;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;


/**
 * @param {!org.riceapps.models.CourseModel} courseModel
 * @param {number} childIndex
 * @implements {org.riceapps.layouts.CalendarLayout.Item}
 * @implements {org.riceapps.views.DraggableView.DropTarget}
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.CourseCalendarGuideView = function(courseModel, childIndex) {
  goog.base(this);

  /** @private {!org.riceapps.models.CourseModel} */
  this.courseModel_ = courseModel;

  /** @private {!Array.<!Element>} */
  this.boxes_ = [];

  /** @type {number} */
  this.childIndex__ = childIndex;
};
goog.inherits(org.riceapps.views.CourseCalendarGuideView,
              org.riceapps.views.View);
var CourseCalendarGuideView = org.riceapps.views.CourseCalendarGuideView;


/** @enum {string} */
CourseCalendarGuideView.Theme = {
  'CONTAINER': 'course-calendar-guide-view-container',
  'BASE': 'course-calendar-guide-view'
};

/** @const {!Array.<string>} */
CourseCalendarGuideView.Colors = ['#FFFFFF'];


/**
 * @const {goog.math.Rect}
 */
CourseCalendarGuideView.RENDER_ADJUST = new goog.math.Rect(0, 0, 10, 10);


/**
 * @return {number}
 */
CourseCalendarGuideView.prototype.getChildIndex = function() {
  return this.childIndex__;
};


/**
 * @return {!org.riceapps.models.CourseModel}
 */
CourseCalendarGuideView.prototype.getCourseModel = function() {
  return this.courseModel_;
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CourseCalendarGuideView.Theme.CONTAINER);
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.removeBoxes_();
};


/**
 * @private
 */
CourseCalendarGuideView.prototype.removeBoxes_ = function() {
  for (var i = 0; i < this.boxes_.length; i++) {
    goog.dom.removeNode(this.boxes_[i]);
  }

  this.boxes_ = [];
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.getCalendarTimes = function() {
  return this.courseModel_.getCalendarMeetingTimes();
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.drawInRects = function(rects) {
  this.removeBoxes_();
  this.makeBoxesInRects_(rects);
  this.applyColor(this.boxes_);
};


/**
 * @param {!Array.<!Element>} elements
 */
CourseCalendarGuideView.prototype.applyColor = function(elements) {
  var base = this.courseModel_.getColor();
  var color1 = goog.color.lighten(base, 0.2);
  var color2 = goog.color.lighten(base, 0.1);
  var color3 = goog.color.darken(base, 0.1);

  for (var i = 0; i < elements.length; i++) {
    goog.style.setStyle(elements[i], {
      'background': 'linear-gradient(to bottom, rgb(' + color1[0] + ', ' + color1[1] + ', ' + color1[2] + ') 0%, rgb(' + color2[0] + ', ' + color2[1] + ', ' + color2[2] + ') 37%, rgb(' + color3[0] + ', ' + color3[1] + ', ' + color3[2] + ') 100%)',
      'filter': 'none'
    });
  }
};


/**
 * @param {!Array.<goog.math.Rect>} rects
 * @private
 */
CourseCalendarGuideView.prototype.makeBoxesInRects_ = function(rects) {
  var times = this.getCalendarTimes();
  goog.asserts.assert(rects.length == times.length);

  for (var i = 0; i < times.length; i++) {
    var rect = rects[i];

    if (rect == null) {
      continue;
    }

    var numberOfDetails = Math.floor(rect.height / 15);

    var element = goog.dom.createDom(goog.dom.TagName.DIV, CourseCalendarGuideView.Theme.BASE);
    goog.dom.setTextContent(element, this.courseModel_.getTitle());
    goog.dom.appendChild(this.getElement(), element);

    if (numberOfDetails > 1) {
      var div = goog.dom.createDom(goog.dom.TagName.DIV);
      goog.dom.setTextContent(div, times[i]['location']);
      goog.dom.appendChild(element, div);
    }

    if (numberOfDetails > 2) {
      var div = goog.dom.createDom(goog.dom.TagName.DIV);
      goog.dom.setTextContent(div, this.courseModel_.getInstructor().getName());
      goog.dom.appendChild(element, div);
    }

    DomUtils.applyRect(element, rect, CourseCalendarGuideView.RENDER_ADJUST);
    this.boxes_.push(element);
  }
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.getDropContainers = function() {
  return this.boxes_ || [];
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.drop = function(item) {
  window.console.log('CourseCalendarGuideView.drop');
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.dragEnter = function(item) {
  goog.style.setStyle(this.getElement(), {
    'opacity': '0.7'
  });
};


/**
 * @override
 */
CourseCalendarGuideView.prototype.dragLeave = function(item) {
  goog.style.setStyle(this.getElement(), {
    'opacity': '0.3'
  });
};

}); // goog.scope
