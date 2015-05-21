/**
 * Provides a view which displays courses currently scheduled (on calendar) as a list.
 * @author  mschurr
 */

goog.provide('org.riceapps.views.CourseListView');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.views.DraggableView.DropTarget');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



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


/**
 * @const {!Object.<string, function(this:CourseListView, !Element, !org.riceapps.models.CourseModel)>}
 */
CourseListView.COLUMN_RENDERER = {
  'CRN' : function(element, course) {
    goog.dom.setTextContent(element, course.getCrn());
  },
  'Title' : function(element, course) {
    goog.dom.setTextContent(element, course.getTitle());
  },
  'Credits' : function(element, course) {
    goog.dom.setTextContent(element, course.getCreditsAsString());
  },
  'Instructor' : function(element, course) {
    goog.dom.setTextContent(element, course.getInstructorNames());
  },
  'Meetings' : function(element, course) {
    goog.dom.setTextContent(element, course.getMeetingTimesAsString());
  },
  'Distribution' : function(element, course) {
    goog.dom.setTextContent(element, course.getDistributionTypeAsString());
  },
  'Restrictions' : function(element, course) {
    var restrictions = course.getRestrictions();

    for (var i = 0; i < restrictions.length; i++) {
      var div = goog.dom.createDom(goog.dom.TagName.DIV);
      goog.dom.setTextContent(div, restrictions[i]);
      goog.dom.appendChild(element, div);
    }
  },
  'Enrollment' : function(element, course) {
    goog.dom.setTextContent(element, course.getTotalEnrollmentAsString());
  },
  'Waitlisted' : function(element, course) {
    goog.dom.setTextContent(element, course.getTotalWaitlistedAsString());
  }
};


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
};


/**
 * @override
 */
CourseListView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);

  // Remove the existing table (if any).
  if (this.table_) {
    goog.dom.removeNode(this.table_);
    this.table_ = null;
  }

  // Draw a table containing courses.
  this.table_ = goog.dom.createDom(goog.dom.TagName.TABLE, CourseListView.Theme.TABLE);

  // Draw the header row.
  var row = goog.dom.createDom(goog.dom.TagName.TR);
  var col_count = 0;

  for (var title in CourseListView.COLUMN_RENDERER) {
    var column = goog.dom.createDom(goog.dom.TagName.TH);
    goog.dom.setTextContent(column, title);
    goog.dom.appendChild(row, column);
    col_count++;
  }

  goog.dom.appendChild(this.table_, row);

  // Draw data rows.
  for (var i = 0; i < this.courses_.length; i++) {
    row = row = goog.dom.createDom(goog.dom.TagName.TR);

    for (var title in CourseListView.COLUMN_RENDERER) {
      var column = goog.dom.createDom(goog.dom.TagName.TD);
      CourseListView.COLUMN_RENDERER[title].call(this, column, this.courses_[i]);
      goog.dom.appendChild(row, column);
    }

    goog.dom.appendChild(this.table_, row);
  }

  if (this.courses_.length == 0) {
    row = goog.dom.createDom(goog.dom.TagName.TR);
    var column = goog.dom.createDom(goog.dom.TagName.TD, {
      'colspan': col_count
    });
    goog.dom.setTextContent(column, 'The courses scheduled on your calendar will also be listed here.');
    goog.dom.appendChild(row, column);
    goog.dom.appendChild(this.table_, row);
  }

  goog.dom.appendChild(this.getElement(), this.table_);
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

}); // goog.scope
