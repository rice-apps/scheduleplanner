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
goog.require('org.riceapps.views.View');
goog.require('org.riceapps.views.DraggableView');

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

  /** @type {boolean} */
  this.directionsShown_ = false;

  /** @type {Element} */
  this.directionsElement_ = null;
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
CalendarView.DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];


/** @const {!Array.<string>} */
CalendarView.DIRECTION_TEXT = [
  'You are using an early beta release of Rice University Schedule Planner. This release is only tested on ' +
  'Google Chrome. At this time, other browsers, touch screens, and mobile devices are not supported.',
  'To get started, use the search box above.'
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
 * @param {!org.riceapps.events.ViewEvent} event
 */
CalendarView.prototype.handleChildrenChanged_ = function(event) {
  if (this.hasChildren()) {
    this.hideDirections_();
  } else {
    this.showDirections_();
  }
}


/**
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

  var table = goog.dom.createDom(goog.dom.TagName.TABLE, CalendarView.Theme.CALENDAR);
  goog.dom.appendChild(this.getElement(), table);

  var row, cell, i, j, div;

  // Create the header row.
  row = goog.dom.createDom(goog.dom.TagName.TR);
  cell = goog.dom.createDom(goog.dom.TagName.TH, CalendarView.Theme.HOUR);
  goog.dom.appendChild(row, cell);

  for (i = 0; i < CalendarView.DAYS.length; i++) {
    cell = goog.dom.createDom(goog.dom.TagName.TH, CalendarView.Theme.DAY);
    goog.dom.setTextContent(cell, CalendarView.DAYS[i]);
    goog.dom.appendChild(row, cell);
  }

  goog.dom.appendChild(table, row);

  // Create the other rows.
  for (i = 8; i < 22; i += 1) {
    row = goog.dom.createDom(goog.dom.TagName.TR);
    goog.dom.classlist.add(row, 'cal-hour-' + i);

    // Add the hour column.
    cell = goog.dom.createDom(goog.dom.TagName.TH, {
      'rowspan': 2
    });

    goog.dom.classlist.add(cell, CalendarView.Theme.HOUR);

    goog.dom.setTextContent(cell, (i % 12 == 0) ? '12 PM' : i % 12 + ' ' +  (i >= 12 ? 'PM' : 'AM'));
    goog.dom.appendChild(row, cell);

    // Add other columns.
    for (j = 0; j < CalendarView.DAYS.length; j++) {
      cell = goog.dom.createDom(goog.dom.TagName.TD);
      goog.dom.classlist.add(cell, 'cal-day-' + j);
      goog.dom.appendChild(row, cell);
    }

    goog.dom.appendChild(table, row);

    // Add second row.
    row = goog.dom.createDom(goog.dom.TagName.TR);

    for (j = 0; j < CalendarView.DAYS.length; j++) {
      cell = goog.dom.createDom(goog.dom.TagName.TD);
      goog.dom.appendChild(row, cell);
    }

    goog.dom.appendChild(table, row);
  }

  // Directions
  var directionsSpan;
  this.directionsElement_ = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(this.directionsElement_, CalendarView.Theme.DIRECTIONS);
  goog.dom.setTextContent(this.directionsElement_, 'Welcome to Schedule Planner (BETA)!');
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
  window.console.log('CalendarView.relayout');
  this.calendarLayout_.relayout();
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
  goog.asserts.assert(offset < total);
  goog.asserts.assert(start < end);
  var dom = this.getDomHelper();
  var roundedHour = Math.floor(start);
  var element = dom.getElementByClass('cal-hour-' + roundedHour);

  if (!element) {
    return null;
  }

  element = dom.getElementByClass('cal-day-' + day, element);

  if (!element) {
    return null;
  }

  var position = goog.style.getRelativePosition(element, this.getElement());
  var size = goog.style.getSize(element);
  var offsetY = size.height * 2 * (start - roundedHour);
  var width = size.width / total;
  var offsetX = offset * (width);

  return new goog.math.Rect(position.x + offsetX, position.y + offsetY, width - 2, size.height * 2 * (end - start));
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
