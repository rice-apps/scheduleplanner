/**
 * Provides a view which lays out its children on a calendar.
 */
goog.provide('org.riceapps.views.CalendarView');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.Event');
goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('org.riceapps.events.ViewEvent');
goog.require('org.riceapps.layouts.CalendarLayout');
goog.require('org.riceapps.layouts.CalendarLayout.Calendar');
goog.require('org.riceapps.views.DraggableView');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var DraggableView = org.riceapps.views.DraggableView;
var ViewEvent = org.riceapps.events.ViewEvent;



/**
 * @implements {org.riceapps.layouts.CalendarLayout.Calendar}
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.CalendarView = function() {
  goog.base(this);

  /** @private {!org.riceapps.layouts.CalendarLayout} */
  this.calendarLayout_ = new org.riceapps.layouts.CalendarLayout(this);

  /** @private {boolean} */
  this.directionsShown_ = false;

  /** @private {Element} */
  this.directionsElement_ = null;

  /** @private {boolean} */
  this.showSaturday_ = false;

  /** @private {boolean} */
  this.showSunday_ = false;
};
goog.inherits(org.riceapps.views.CalendarView,
              org.riceapps.views.View);
var CalendarView = org.riceapps.views.CalendarView;


/** @enum {string} */
CalendarView.Theme = {
  BASE: 'calendar-view',
  CALENDAR: 'calendar',
  HOUR: 'hour',
  DAY: 'day',
  DIRECTIONS: 'calendar-view-directions'
};


/** @const {!Array.<string>} */
CalendarView.DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


/** @const {!Array.<string>} */
CalendarView.DIRECTION_TEXT = [
  'You are using an early release of Rice University Schedule Planner. This release is only tested on Google Chrome. At this time, other browsers, touch screens, and mobile devices may not be fully supported.',
  'We need your help to make Schedule Planner better! Please report any bugs you encounter and take a moment to provide feedback by using the links at the bottom of the page.',
  'To get started, read the directions to the left.'
];


/**
 * @override
 */
CalendarView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this,
      [ViewEvent.Type.CHILD_ADDED, ViewEvent.Type.CHILD_REMOVED], this.handleChildrenChanged_);
};


/**
 * @override
 */
CalendarView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().unlisten(this,
      [ViewEvent.Type.CHILD_ADDED, ViewEvent.Type.CHILD_REMOVED], this.handleChildrenChanged_);
};


/**
 * @param {number} day A day of the week (0 = Sunday through 6 = Saturday).
 * @return {boolean} Whether or not any children have a meeting on that day.
 */
CalendarView.prototype.hasCoursesOnDay = function(day) {
  var items = this.getCalendarItems();
  for (var i = 0; i < items.length; i++) {
    var times = items[i].getCalendarTimes();

    for (var j = 0; j < times.length; j++) {
      if (times[j]['day'] == day) {
        return true;
      }
    }
  }

  return false;
};


/**
 * Event handler; called when a child is added or removed.
 * @param {!org.riceapps.events.ViewEvent} event
 * @private
 */
CalendarView.prototype.handleChildrenChanged_ = function(event) {
  // Show/hide the directions based on whether or not the calendar has courses on it.
  if (this.hasChildren()) {
    this.hideDirections_();
  } else {
    this.showDirections_();
  }

  // Determine whether or not to display the "Sunday" and "Saturday" columns.
  // These columns should only be displayed when a course meets on that day.
  var oldShowSunday = this.showSunday_;
  var oldShowSaturday = this.showSaturday_;
  this.showSunday_ = this.hasCoursesOnDay(0);
  this.showSaturday_ = this.hasCoursesOnDay(6);

  if (oldShowSunday != this.showSunday_ || oldShowSaturday != this.showSaturday_) {
    this.relayout();
  }
};


/**
 * Shows the welcome message and directions.
 * @return {void}
 * @private
 */
CalendarView.prototype.showDirections_ = function() {
  if (this.directionsShown_) {
    return;
  }

  goog.style.setElementShown(this.directionsElement_, true);
  this.directionsShown_ = true;
};


/**
 * Hides the welcome message and directions.
 * @return {void}
 * @private
 */
CalendarView.prototype.hideDirections_ = function() {
  if (!this.directionsShown_) {
    return;
  }

  goog.style.setElementShown(this.directionsElement_, false);
  this.directionsShown_ = false;
};


/**
 * @override
 */
CalendarView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CalendarView.Theme.BASE);
  //goog.style.setStyle(this.getElement(), {'padding-right': '5px'});

  // Create a table to hold the week of the calendar.
  // Rows are hours and columns are days.
  var table = goog.dom.createDom(goog.dom.TagName.TABLE, CalendarView.Theme.CALENDAR);
  goog.dom.appendChild(this.getElement(), table);

  var row, cell, i, j, div;

  // Create the header row.
  row = goog.dom.createDom(goog.dom.TagName.TR);
  cell = goog.dom.createDom(goog.dom.TagName.TH, CalendarView.Theme.HOUR);
  goog.dom.classlist.add(cell, 'cal-header-hour');
  goog.dom.appendChild(row, cell);

  for (i = 0; i < CalendarView.DAYS.length; i++) {
    cell = goog.dom.createDom(goog.dom.TagName.TH, CalendarView.Theme.DAY);
    goog.dom.setTextContent(cell, CalendarView.DAYS[i]);
    goog.dom.classlist.add(cell, 'cal-toggle-day-' + i);
    goog.dom.classlist.add(cell, 'cal-header-day-' + i);
    goog.dom.appendChild(row, cell);
  }

  goog.dom.appendChild(table, row);

  // Create the other rows (hours).
  for (i = 8; i < 22; i += 1) {
    row = goog.dom.createDom(goog.dom.TagName.TR);
    goog.dom.classlist.add(row, 'cal-hour-' + i);

    // Add the hour column for first half hour.
    cell = goog.dom.createDom(goog.dom.TagName.TH, {
      'rowspan': 2
    });

    goog.dom.classlist.add(cell, CalendarView.Theme.HOUR);

    goog.dom.setTextContent(cell, (i % 12 == 0) ? '12 PM' : i % 12 + ' ' + (i >= 12 ? 'PM' : 'AM'));
    goog.dom.appendChild(row, cell);

    // Add columns for each day.
    for (j = 0; j < CalendarView.DAYS.length; j++) {

      cell = goog.dom.createDom(goog.dom.TagName.TD);
      goog.dom.classlist.add(cell, 'cal-day-' + j);
      goog.dom.classlist.add(cell, 'cal-toggle-day-' + j);
      goog.dom.appendChild(row, cell);
    }

    goog.dom.appendChild(table, row);

    // Add second row (same as the first, but for second half hour of the hour).
    row = goog.dom.createDom(goog.dom.TagName.TR);

    for (j = 0; j < CalendarView.DAYS.length; j++) {
      cell = goog.dom.createDom(goog.dom.TagName.TD);
      goog.dom.classlist.add(cell, 'cal-toggle-day-' + j);
      goog.dom.appendChild(row, cell);
    }

    goog.dom.appendChild(table, row);
  }

  // Render welcome/directions message.
  var directionsSpan;
  this.directionsElement_ = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(this.directionsElement_, CalendarView.Theme.DIRECTIONS);
  goog.dom.setTextContent(this.directionsElement_, 'Welcome to Schedule Planner!');
  goog.dom.appendChild(this.getElement(), this.directionsElement_);

  for (i = 0; i < CalendarView.DIRECTION_TEXT.length; i++) {
  directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
    goog.dom.setTextContent(directionsSpan, CalendarView.DIRECTION_TEXT[i]);
    goog.dom.appendChild(this.directionsElement_, directionsSpan);
  }

  this.showDirections_();
};


/**
 * @override
 */
CalendarView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('CalendarView.relayout', {
    'sunday' : this.showSunday_,
    'saturday' : this.showSaturday_
  });
  var nodes;

  // Hide/show columns for Saturday and Sunday dynamically (based on whether or not needed by some placed course).
  nodes = this.getElement().querySelectorAll('.cal-toggle-day-0');
  for (var i = 0; i < nodes.length; i++) {
    goog.style.setElementShown(nodes[i], this.showSunday_);
  }

  nodes = this.getElement().querySelectorAll('.cal-toggle-day-6');
  for (var i = 0; i < nodes.length; i++) {
    goog.style.setElementShown(nodes[i], this.showSaturday_);
  }

  // Recalculate the width of all cells in the table based on the number of columns now in the calendar.
  var dayWidth = 18;
  var hourWidth = 10;

  if (this.showSunday_ && this.showSaturday_) {
    dayWidth = 13;
    hourWidth = 9;
  } else if (this.showSunday_ || this.showSaturday_) {
    dayWidth = 15;
    hourWidth = 10;
  }

  // And update the cells in the calendar table with the calculated widths.
  goog.style.setStyle(this.getElement().querySelector('.cal-header-hour'), {'width': hourWidth + '%'});

  for (var i = 0; i < CalendarView.DAYS.length; i++) {
    goog.style.setStyle(this.getElement().querySelector('.cal-header-day-' + i),
        {'width': dayWidth + '%'});
  }

  // Re-draw items on the calendar.
  this.calendarLayout_.relayout();

  // Call the superclass.
  goog.base(this, 'relayout', opt_preventAnimation);
};


/**
 * @override
 */
CalendarView.prototype.addChildAt = function(child, index, opt_render) {
  goog.base(this, 'addChildAt', child, index, opt_render);
  this.calendarLayout_.relayout();
};


/**
 * @override
 */
CalendarView.prototype.getCalendarItemRect = function(day, start, end, offset, total) {
  if (day == 0 && !this.showSunday_) return null;
  if (day == 6 && !this.showSaturday_) return null;

  goog.asserts.assert(offset < total);
  goog.asserts.assert(start < end);
  var dom = this.getDomHelper();
  var roundedHour = Math.floor(start);

  // Find the element holding row closest to hour at which course starts.
  var element = dom.getElementByClass('cal-hour-' + roundedHour, this.getElement());

  if (!element) {
    return null;
  }

  // Find the element holding column for day within that hour row.
  element = dom.getElementByClass('cal-day-' + day, element);

  if (!element) {
    return null;
  }

  // Get the adjusted relative position of the (hour row, day column) element to the view base.
  var position = goog.style.getRelativePosition(element, this.getElement());

  // Calculate the rectangle in which an item occuring on 'day' from time 'start' to 'end' using offset and total.
  // See CalendarLayout for documentation on these parameters.
  var size = goog.style.getSize(element);
  var offsetY = size.height * 2 * (start - roundedHour);
  var width = size.width / total;
  var offsetX = offset * (width);

  var x = position.x + offsetX;
  var y = position.y + offsetY;

  return new goog.math.Rect(x, y, width - 2, size.height * 2 * (end - start));
};


/**
 * @override
 */
CalendarView.prototype.getCalendarItems = function() {
  var items = [];

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = /** @type {!org.riceapps.layouts.CalendarLayout.Item} */ (this.getChildAt(i));

    if (child instanceof DraggableView && child.isBeingDragged()) {
      continue;
    }

    items.push(child);
  }

  return items;
};

}); // goog.scope
