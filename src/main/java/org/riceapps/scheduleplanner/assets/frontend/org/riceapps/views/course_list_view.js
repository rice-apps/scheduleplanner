/**
 * Provides a view which displays courses currently scheduled (on calendar) as a list.
 * @author  mschurr
 */

goog.provide('org.riceapps.views.CourseListView');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('org.riceapps.events.ContextMenuEvent');
goog.require('org.riceapps.events.ContextMenuEvent.Type');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.views.ContextMenuView');
goog.require('org.riceapps.views.DraggableView.DropTarget');
goog.require('org.riceapps.views.ListCourseView');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;
var ListCourseView = org.riceapps.views.ListCourseView;



/**
 * @extends {org.riceapps.views.View}
 * @implements {org.riceapps.views.DraggableView.DropTarget}
 * @constructor
 */
org.riceapps.views.CourseListView = function() {
  goog.base(this);

  /** @private {!Array.<!org.riceapps.models.CourseModel>} */
  this.courses_ = [];

  /** @private {Element} */
  this.table_ = null;

  /** @private {Element} */
  this.tableBody_ = null;

  /** @private {Element} */
  this.emptyRow_ = null;
};
goog.inherits(org.riceapps.views.CourseListView,
              org.riceapps.views.View);
var CourseListView = org.riceapps.views.CourseListView;


/**
 * @enum {string}
 */
CourseListView.Theme = {
  BASE: 'course-list-view',
  TABLE: 'course-list-view-table'
};


/** @const {!Array.<string>} */
CourseListView.COLUMNS = [
  'CRN',
  'Title',
  'Credits',
  'Instructor',
  'Meetings',
  'Distribution',
  'Restrictions',
  'Enrollment',
  'Waitlisted'
];


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
CourseListView.prototype.setCourses = function(courses) {
  this.courses_ = [];

  for (var i = 0; i < courses.length; i++) {
    goog.array.insert(this.courses_, courses[i]);
  }

  this.handleChildrenChanged_();
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
CourseListView.prototype.addCourses = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    goog.array.insert(this.courses_, courses[i]);
  }

  this.handleChildrenChanged_();
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
CourseListView.prototype.removeCourses = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    goog.array.remove(this.courses_, courses[i]);
  }

  this.handleChildrenChanged_();
};


/**
 * @private
 */
CourseListView.prototype.handleChildrenChanged_ = function() {
  this.courses_.sort(function(a, b) {
    if (a.getSubject() == b.getSubject()) {
      return a.getCourseNumber() - b.getCourseNumber();
    } else {
      return goog.string.caseInsensitiveCompare(a.getSubject(), b.getSubject());
    }
  });

  this.relayout();
};


/**
 * @override
 */
CourseListView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CourseListView.Theme.BASE);
  this.table_ = goog.dom.createDom(goog.dom.TagName.TABLE, CourseListView.Theme.TABLE);
  goog.dom.appendChild(this.getElement(), this.table_);

  var tableHead = goog.dom.createDom(goog.dom.TagName.THEAD);
  goog.dom.appendChild(this.table_, tableHead);

  this.tableBody_ = goog.dom.createDom(goog.dom.TagName.TBODY);
  goog.dom.appendChild(this.table_, this.tableBody_);

  var row = goog.dom.createDom(goog.dom.TagName.TR);
  var column;
  for (var i = 0; i < CourseListView.COLUMNS.length; i++) {
    column = goog.dom.createDom(goog.dom.TagName.TH);
    goog.dom.setTextContent(column, CourseListView.COLUMNS[i]);
    goog.dom.appendChild(row, column);
  }
  goog.dom.appendChild(tableHead, row);


  this.emptyRow_ = row = goog.dom.createDom(goog.dom.TagName.TR);
  column = goog.dom.createDom(goog.dom.TagName.TD, {'colspan': CourseListView.COLUMNS.length});
  goog.dom.setTextContent(column, 'The courses scheduled on your calendar will also be listed here.');
  goog.dom.appendChild(row, column);
  goog.dom.appendChild(this.tableBody_, row);
};


/**
 * @override
 */
CourseListView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);
  this.removeChildren(true);

  for (var i = 0; i < this.courses_.length; i++) {
    var view = new ListCourseView(this.courses_[i]);
    this.addChild(view, this.isInDocument());
  }

  if (this.isInDocument()) {
    if (this.courses_.length == 0) {
      goog.style.setElementShown(this.emptyRow_, true);
    } else {
      goog.style.setElementShown(this.emptyRow_, false);
    }
  }
};


/**
 * @override
 */
CourseListView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * @override
 */
CourseListView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
};


/**
 * @override
 */
CourseListView.prototype.getDropContainers = function() {
  return [this.getElementStrict()];
};


/**
 * @override
 */
CourseListView.prototype.drop = function(item) {};


/**
 * @override
 */
CourseListView.prototype.dragEnter = function(item) {};


/**
 * @override
 */
CourseListView.prototype.dragLeave = function(item) {};


/**
 * @override
 */
CourseListView.prototype.getContentElement = function() {
  return this.tableBody_;
};

}); // goog.scope
