/**
 * Provides a generic view representing a course which implements functionality shared amongst all different types of course views.
 */

goog.provide('org.riceapps.views.AbstractCourseView');

goog.require('goog.color');
goog.require('goog.color.Rgb');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('goog.window');
goog.require('org.riceapps.events.ContextMenuEvent');
goog.require('org.riceapps.events.ContextMenuEvent.Type');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.views.ContextMenuView');
goog.require('org.riceapps.views.CourseCalendarGuideView');
goog.require('org.riceapps.views.DraggableView');

goog.scope(function() {
var ContextMenuEvent = org.riceapps.events.ContextMenuEvent;
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

  /** @private {!Array.<!org.riceapps.views.CourseCalendarGuideView>} */
  this.guideViews_ = [];

  /** @private {org.riceapps.views.ContextMenuView} */
  this.contextMenu_ = null;

  /** @type {string} */
  this.debug = this.courseModel_.getTitle();

  /** @private {boolean} */
  this.contextMenuIsEnabled_ = true;
};
goog.inherits(org.riceapps.views.AbstractCourseView,
              org.riceapps.views.DraggableView);
var AbstractCourseView = org.riceapps.views.AbstractCourseView;


/** @enum {number} */
AbstractCourseView.Option = {
  VIEW_INFO: 1,
  VIEW_EVALS: 2,
  MOVE_TO_PLAYGROUND: 3,
  REMOVE: 4,
  MOVE_TO_CALENDAR: 5,
  VIEW_IN_CATALOG: 6
};


/**
 * @param {!Array.<!Element>} elements
 */
AbstractCourseView.prototype.applyColor = function(elements) {
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
    listen(this, DraggableView.EventType.DRAGSTART, this.onDragStart_).
    listen(this, DraggableView.EventType.DRAGEND, this.onDragEnd_).
    listen(this.getElement(), goog.events.EventType.CONTEXTMENU, this.handleContextMenu_);
};


/**
 * @override
 */
AbstractCourseView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().
    unlisten(this, DraggableView.EventType.DRAGSTART, this.onDragStart_).
    unlisten(this, DraggableView.EventType.DRAGEND, this.onDragEnd_).
    unlisten(this.getElement(), goog.events.EventType.CONTEXTMENU, this.handleContextMenu_);
};


/**
 * @param {boolean} isEnabled
 */
AbstractCourseView.prototype.setContextMenuEnabled = function(isEnabled) {
  this.contextMenuIsEnabled_ = isEnabled;
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
AbstractCourseView.prototype.handleContextMenu_ = function(event) {
  window.console.log('AbstractCourseView.handleContextMenu_');

  if (!this.contextMenuIsEnabled_) {
    return;
  }

  // Override the browser context menu from displaying.
  event.preventDefault();

  // Clean existing context menu (if any).
  if (this.contextMenu_) {
    this.handleContextMenuClosed_();
  }

  // Create the view.
  var scroll = goog.dom.getDomHelper().getDocumentScroll();
  this.contextMenu_ = new org.riceapps.views.ContextMenuView(scroll.x + event.clientX - 1, scroll.y + event.clientY - 1);

  // Install event handlers.
  this.getHandler().
      listen(this.contextMenu_, ContextMenuEvent.Type.CLOSE, this.handleContextMenuClosed_).
      listen(this.contextMenu_, ContextMenuEvent.Type.OPTION_CLICK, this.handleContextMenuOptionClick_);

  // Add options.
  this.contextMenu_.setOption(AbstractCourseView.Option.VIEW_INFO, 'View Information');
  this.contextMenu_.setOption(AbstractCourseView.Option.VIEW_EVALS, 'View Evaluations');
  this.contextMenu_.setOption(AbstractCourseView.Option.VIEW_IN_CATALOG, 'View in Course Catalog');

  if (!this.isInPlayground()) {
    this.contextMenu_.setOption(AbstractCourseView.Option.MOVE_TO_PLAYGROUND, 'Move to Staging Area');
  }

  if (!this.isInCalendar() && !this.isInList() && this.getCourseModel().getAllSections().length == 1) {
    this.contextMenu_.setOption(AbstractCourseView.Option.MOVE_TO_CALENDAR, 'Move to Calendar');
  }

  if (!this.isInSearch()) {
    this.contextMenu_.setOption(AbstractCourseView.Option.REMOVE, 'Remove');
  }

  // TODO(mschurr): Add/move to calendar (from search or playground): support for multiple sections.
  // TODO(mschurr): Switch sections (from calendar).

  // Display the view.
  this.contextMenu_.show();
};


/**
 * @param {ContextMenuEvent=} opt_event
 * @private
 */
AbstractCourseView.prototype.handleContextMenuClosed_ = function(opt_event) {
  window.console.log('AbstractCourseView.handleContextMenuClosed_');

  // Uninstall event handlers.
  this.getHandler().
      unlisten(this.contextMenu_, ContextMenuEvent.Type.CLOSE, this.handleContextMenuClosed_).
      unlisten(this.contextMenu_, ContextMenuEvent.Type.OPTION_CLICK, this.handleContextMenuOptionClick_);

  // Free the memory for garbage collection.
  this.contextMenu_ = null;
};


/**
 * @param {ContextMenuEvent} event
 * @private
 */
AbstractCourseView.prototype.handleContextMenuOptionClick_ = function(event) {
  var optionId = event.getOptionId();
  window.console.log('AbstractCourseView.handleContextMenuOptionClick_', optionId);

  switch (optionId) {
    case AbstractCourseView.Option.VIEW_INFO:
      var newEvent = new SchedulePlannerEvent(SchedulePlannerEvent.Type.SHOW_COURSE_DETAILS);
      newEvent.model = this.getCourseModel();
      this.dispatchEvent(newEvent);
      break;
    case AbstractCourseView.Option.VIEW_EVALS:
      var newEvent = new SchedulePlannerEvent(SchedulePlannerEvent.Type.SHOW_COURSE_EVALS);
      newEvent.model = this.getCourseModel();
      this.dispatchEvent(newEvent);
      break;
    case AbstractCourseView.Option.MOVE_TO_PLAYGROUND:
      var newEvent = new SchedulePlannerEvent(SchedulePlannerEvent.Type.MOVE_TO_PLAYGROUND);
      newEvent.model = this.getCourseModel();
      this.dispatchEvent(newEvent);
      break;
    case AbstractCourseView.Option.REMOVE:
      var newEvent = new SchedulePlannerEvent(SchedulePlannerEvent.Type.REMOVE_COURSE);
      newEvent.model = this.getCourseModel();
      this.dispatchEvent(newEvent);
      break;
    case AbstractCourseView.Option.MOVE_TO_CALENDAR:
      var newEvent = new SchedulePlannerEvent(SchedulePlannerEvent.Type.MOVE_TO_CALENDAR);
      newEvent.model = this.getCourseModel();
      this.dispatchEvent(newEvent);
      break;
    case AbstractCourseView.Option.VIEW_IN_CATALOG:
      goog.window.open(this.getCourseModel().getLink(), {'target': '_blank'});
      break;
    default:
      break;
  }
};


/**
 * @return {boolean}
 */
AbstractCourseView.prototype.isInCalendar = function() {
  return false;
};


/**
 * @return {boolean}
 */
AbstractCourseView.prototype.isInPlayground = function() {
  return false;
};


/**
 * @return {boolean}
 */
AbstractCourseView.prototype.isInSearch = function() {
  return false;
};


/**
 * @return {boolean}
 */
AbstractCourseView.prototype.isInList = function() {
  return false;
};


/**
 * @return {boolean}
 */
AbstractCourseView.prototype.shouldShowInfoOnClick = function() {
  return true;
};


/**
 * @param {goog.events.Event} event
 * @private
 */
AbstractCourseView.prototype.onDragStart_ = function(event) {
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
AbstractCourseView.prototype.onDragEnd_ = function(event) {
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
 * @param {!Array.<org.riceapps.views.CourseCalendarGuideView>} guideViews
 */
AbstractCourseView.prototype.setGuideViews = function(guideViews) {
  this.removeGuideViews_();
  this.guideViews_ = [];
};

});  // goog.scope
