goog.provide('org.riceapps.views.AbstractCourseView');

goog.require('goog.events.Event');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.views.DraggableView');
goog.require('org.riceapps.views.CourseCalendarGuideView');

goog.scope(function() {
var DraggableView = org.riceapps.views.DraggableView;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;


/**
 * @param {!org.riceapps.models.CourseModel} courseModel
 * @extends {org.riceapps.views.DraggableView}
 * @constructor
 */
org.riceapps.views.AbstractCourseView = function(courseModel) {
  goog.base(this);

  /** @private {!org.riceapps.models.CourseModel} */
  this.courseModel_ = courseModel;

  /** @private {!Array.<org.riceapps.views.CourseCalendarGuideView>} */
  this.guideViews_ = [];

  /** @type {string} */
  this.debug = this.courseModel_.getTitle();
};
goog.inherits(org.riceapps.views.AbstractCourseView,
              org.riceapps.views.DraggableView);
var AbstractCourseView = org.riceapps.views.AbstractCourseView;


/**
 * @return {!org.riceapps.models.CourseModel}
 */
AbstractCourseView.prototype.getCourseModel = function() {
  return this.courseModel_;
};


/**
 * @override
 */
AbstractCourseView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(this, DraggableView.EventType.DRAGSTART, this.handleDragStart_).
    listen(this, DraggableView.EventType.DRAGEND, this.handleDragEnd_);
};


/**
 * @override
 */
AbstractCourseView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().
    unlisten(this, DraggableView.EventType.DRAGSTART, this.handleDragStart_).
    unlisten(this, DraggableView.EventType.DRAGEND, this.handleDragEnd_);
};


/**
 * @param {goog.events.Event} event
 * @private
 */
AbstractCourseView.prototype.handleDragStart_ = function(event) {
  window.console.log('AbstractCourseView dragStart');

  // Set the drag source to be invisible.
  if (this.shouldHideElementOnDrag()) {
    goog.style.setElementShown(this.getElement(), false);
  } else {
    goog.style.setStyle(this.getElement(), {
      'opacity': '0.3'
    });
  }

  // NOTE: Add the guide views to the child index directly after the course view so that position on calendar will not
  // change.
  this.removeGuideViews_();

  var courseModels = this.courseModel_.getAllSections();

  this.guideViews_ = [];

  for (var i = 0; i < courseModels.length; i++) {
    var guideView = new org.riceapps.views.CourseCalendarGuideView(courseModels[i], this.getChildInsertionIndex());
    this.addDropTarget(guideView);
    this.guideViews_.push(guideView);
  }

  this.dispatchEvent(new goog.events.Event(SchedulePlannerEvent.Type.ADD_GUIDE_VIEWS));
};


/**
 * @return {number}
 */
AbstractCourseView.prototype.getChildInsertionIndex = function() {
  return 0;
};


/**
 * @return {boolean}
 */
AbstractCourseView.prototype.shouldHideElementOnDrag = function() {
  return false;
};



/**
 * @param {goog.events.Event} event
 * @private
 */
AbstractCourseView.prototype.handleDragEnd_ = function(event) {
  window.console.log('AbstractCourseView dragEnd');

  // Set the drag source to be visible again.
  if (this.shouldHideElementOnDrag()) {
    goog.style.setElementShown(this.getElement(), true);
  } else {
    goog.style.setStyle(this.getElement(), {
      'opacity': '1'
    });
  }

  // Remove any placed guide views.
  this.removeGuideViews_();
};


/**
 * @private
 */
AbstractCourseView.prototype.removeGuideViews_ = function() {
  for (var i = 0; i < this.guideViews_.length; i++) {
    this.removeDropTarget(this.guideViews_[i]);
    this.guideViews_[i].getParent().removeChild(this.guideViews_[i], true);
    this.guideViews_[i].dispose();
  }

  this.guideViews_ = [];
};


/**
 * @return {!Array.<org.riceapps.views.CourseCalendarGuideView>}
 */
AbstractCourseView.prototype.getGuideViews = function() {
  return this.guideViews_;
};

/**
 * @return {!Array.<org.riceapps.views.CourseCalendarGuideView>}
 */
AbstractCourseView.prototype.setGuideViews = function(guideViews) {
  this.removeGuideViews_();
  this.guideViews_ = [];
};

});  // goog.scope
