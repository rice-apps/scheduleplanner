goog.provide('org.riceapps.layouts.CalendarLayout');
goog.provide('org.riceapps.layouts.CalendarLayout.Calendar');
goog.provide('org.riceapps.layouts.CalendarLayout.Item');

goog.require('goog.math.Rect');
goog.require('org.riceapps.models.CourseModel');

goog.scope(function() {



/**
 * Represents a calendar.
 * @interface
 */
org.riceapps.layouts.CalendarLayout.Calendar = function() {};


/**
 * Returns the rectangle in which a view embedded on the calendar should be drawn given its day and hour, or null if
 * unable to determine where to render the item.
 * @type {number} day (0 Sunday to 6 Satuday)
 * @type {number} start (number of hours since midnight; decimal values accepted)
 * @type {number} end (number of horus since midnight; decimal values accepted)
 * @tyoe {number} offset (offset within the timeslot at which to render)
 * @type {number} total (total number of columns within the time slot)
 * @return {goog.math.Rect}
 */
org.riceapps.layouts.CalendarLayout.Calendar.prototype.getCalendarItemRect =
    function(day, start, end, offset, total) {};


/**
 * Returns the items in the calendar.
 * @return {!Array.<!org.riceapps.layouts.CalendarLayout.Item>}
 */
org.riceapps.layouts.CalendarLayout.Calendar.prototype.getCalendarItems = function() {};



/**
 * Represents an item in a calendar.
 * @interface
 */
org.riceapps.layouts.CalendarLayout.Item = function() {};


/**
 * Informs the item of the positions and dimensions in which it should render itself.
 * The rectangles are in order corresponding to the order provided by the last call to getCalendarTimes().
 * @param {!Array.<!goog.math.Rect>} rects
 */
org.riceapps.layouts.CalendarLayout.Item.prototype.drawInRects = function(rects) {};


/**
 * Returns the times at which this calendar item wishes to position itself.
 * @return {!Array.<!CourseModel.MeetingTime>}
 */
org.riceapps.layouts.CalendarLayout.Item.prototype.getCalendarTimes = function() {};



/**
 * A calendar layout is responsible for positioning the items within a calendar. To position the items, simply call
 * relayout() provided both the calendar and its items implement the required interfaces.
 *
 * NOTE: This layout is still not **perfect**, but it works good in almost every case. Issues occur because calculating
 * limit does not take into account things not in the row that affect layout of things extending into the row.
 *
 * @param {!org.riceapps.layouts.CalendarLayout.Calendar} calendar
 * @constructor
 */
org.riceapps.layouts.CalendarLayout = function(calendar) {
  /** @private {!org.riceapps.layouts.CalendarLayout.Calendar} */
  this.calendar_ = calendar;
};
var CalendarLayout = org.riceapps.layouts.CalendarLayout;


/** @const {number} */
CalendarLayout.PRECISION = 4;


/**
 * A naive relayout operation which assumes there will never be any time conflicts between rendered courses.
 * @private
 */
CalendarLayout.prototype.naiveRelayout_ = function() {
  window.console.log('CalendarLayout.naiveRelayout_');
  var items = this.calendar_.getCalendarItems();
  for (var i = 0; i < items.length; i++) {
    var times = items[i].getCalendarTimes();
    var rects = [];

    for (var j = 0; j < times.length; j++) {
      rects.push(this.calendar_.getCalendarItemRect(times[j]['day'], times[j]['start'], times[j]['end'], 0 , 1));
    }

    items[i].drawInRects(rects);
  }
};


/**
 * Calculates the position at which each item in the calendar should be rendered and informs the calendar items of their
 * positions.
 */
CalendarLayout.prototype.relayout = function() {
  window.console.log('CalendarLayout.relayout');
  var matrix = this.createMatrix_();
  var offsets = {};

  // Ask the calendar for all of the items.
  var items = this.calendar_.getCalendarItems();

  // Calculate the layout of the calendar.
  for (var i = 0; i < items.length; i++) {
    offsets[i] = [];
    var item = items[i];
    var times = item.getCalendarTimes();

    for (var j = 0; j < times.length; j++) {
      var time = times[j];
      var offset = this.placeItem_(matrix, items, item, time);
      offsets[i].push(offset);
    }
  }

  // Inform the calendar items of their positions.
  for (var i = 0; i < items.length; i++) {
    var times = items[i].getCalendarTimes();
    var rects = [];

    for (var j = 0; j < times.length; j++) {
      var place = this.getLimit_(matrix, item, times[j]['day'], times[j]['start'], times[j]['end'], offsets[i][j]);
      rects.push(this.calendar_.getCalendarItemRect(
        times[j]['day'],
        times[j]['start'],
        times[j]['end'],
        place.offset,
        place.limit
      ));
    }

    items[i].drawInRects(rects);
  }
};


/**
 * @param {!Object.<number, !Object.<number, !Array.<org.riceapps.layouts.CalendarLayout.Item>>>} matrix
 * @param {!org.riceapps.layouts.CalendarLayout.Item} item
 * @param {number} day
 * @param {number} start
 * @param {number} end
 * @return {{
 *   offset: number,
 *   limit: number
 * }}
 */
CalendarLayout.prototype.getLimit_ = function(matrix, item, day, start, end, offset) {
  //window.console.log(matrix, 'day', day, 'start', start, 'end', end, 'offset', offset);
  var maxChanges = 1;

  for (var hour = Math.floor(start * CalendarLayout.PRECISION);
       hour < Math.ceil(end * CalendarLayout.PRECISION);
       hour += 1) {
    var changes = 0;
    var last = null;
    for (var i = 0; i < matrix[day][hour].length; i++) {
      if (matrix[day][hour][i] !== last) {
        changes++;
      }
      last = matrix[day][hour][i];
    }
    //window.console.log('changes', changes);
    maxChanges = Math.max(changes, maxChanges);
  }

  //window.console.log('offset', offset, 'limit', changes);

  return {
    offset: offset,
    limit:  Math.max(maxChanges, offset + 1)
  };
}


/**
 * @param {!Object.<number, !Object.<number, !Array.<org.riceapps.layouts.CalendarLayout.Item>>>} matrix
 */
CalendarLayout.prototype.expandMatrix_ = function(matrix) {
  for (var day = 0; day < 7; day ++) {
    for (var hour = 0; hour < 24 * CalendarLayout.PRECISION; hour++) {
      if (matrix[day][hour].length == 0) {
        matrix[day][hour].push(null);
      } else {
        matrix[day][hour].push(matrix[day][hour][matrix[day][hour].length - 1]);
      }
    }
  }
}


/**
 * @param {!Object.<number, !Object.<number, !Array.<org.riceapps.layouts.CalendarLayout.Item>>>} matrix
 * @param {!Array.<!org.riceapps.layouts.CalendarLayout.Item>} items
 * @param {!org.riceapps.layouts.CalendarLayout.Item} item
 * @param {!org.riceapps.models.CourseModel.MeetingTime} time
 * @return {number}
 */
CalendarLayout.prototype.placeItem_ = function(matrix, items, item, time) {
  var day = time['day'];
  var start = time['start'];
  var end = time['end'];
  var offset = 0;

  while (true) {
    var placed = this.canPlaceAt_(matrix, day, start, end, offset);

    if (placed) {
      break;
    }

    offset++;
  }

  for (var hour = Math.floor(start * CalendarLayout.PRECISION);
       hour < Math.ceil(end * CalendarLayout.PRECISION);
       hour += 1) {
    // Ensure there is sufficient space.
    while (offset >= matrix[day][hour].length) {
      this.expandMatrix_(matrix);
    }
    var initial = matrix[day][hour][offset];
    for (var i = offset; i <  matrix[day][hour].length; i++) {
      if (matrix[day][hour][i] === initial ||
          matrix[day][hour][i] === null) {
        matrix[day][hour][i] = item;
      }
    }
  }

  return offset;
};


/**
 * @param {!Object.<number, !Object.<number, !Array.<org.riceapps.layouts.CalendarLayout.Item>>>} matrix
 * @param {number} day
 * @param {number} start
 * @param {number} end
 * @param {number} offset
 * @return {boolean}
 */
CalendarLayout.prototype.canPlaceAt_ = function(matrix, day, start, end, offset) {
  for (var hour = Math.floor(start * CalendarLayout.PRECISION);
       hour < Math.ceil(end * CalendarLayout.PRECISION);
       hour += 1) {
    if (offset < matrix[day][hour].length && matrix[day][hour][offset] &&
        matrix[day][hour][offset] !== matrix[day][hour][offset - 1]) {
      return false;
    }
  }

  return true;
};


/**
 * @return {!Object.<number, !Object.<number, !Array.<org.riceapps.layouts.CalendarLayout.Item>>>}
 */
CalendarLayout.prototype.createMatrix_ = function() {
  // Build a matrix of calendar positions.
  var matrix = {};

  for (var day = 0; day < 7; day ++) {
    matrix[day] = {};

    for (var hour = 0; hour < 24 * CalendarLayout.PRECISION; hour++) {
      matrix[day][hour] = [];
    }
  }

  return matrix;
};


});
