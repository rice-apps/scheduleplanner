/**
 * @author Matthew Schurr (mschurr@rice.edu)
 */

// Provides
jslib.provides('org.riceapps.scheduleplanner.views.CalendarView');

jslib.scope(function(){
var View = org.riceapps.scheduleplanner.views.View;
var DraggableCalendarItemView = org.riceapps.scheduleplanner.views.DraggableCalendarItemView;

// Constructor
org.riceapps.scheduleplanner.views.CalendarView = function() {
	this.superConstructor();

	// Properties
	/** @private {?Element} */
	this.dom_ = null;

	/** @private {!Array.<Object>} */
	this.placementViews_ = [];

	/** @private {!Array.<Object>} */
	this.scheduleViews_ = [];

	/** @private {!Array.<View>} */
	this.guides_ = [];

	// Initialization
	this.bindEvent(window, 'resize', this.onResize_);
	this.subscribe(this, View.Event.CHILD_ADDED, this.onChildAdded_);
	this.subscribe(this, View.Event.CHILD_REMOVED, this.onChildRemoved_);
};
jslib.inherits(org.riceapps.scheduleplanner.views.CalendarView,
	           org.riceapps.scheduleplanner.views.View);
var CalendarView = org.riceapps.scheduleplanner.views.CalendarView;

// Constants

// Methods
CalendarView.prototype.renderIn = function(element) {
	var calendar = $('<div />', {
		'class' : 'calendar'
	});

	var table = $('<table />', {
		'class' : 'calendar'
	});
	table.appendTo(calendar);

	var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
	var row, cell, i, j, div;

	// Header row
	row = $('<tr />');

	cell = $('<th />', {
		'class' : 'hour'
	});
	cell.appendTo(row);

	for(i = 0; i < days.length; i++) {
		cell = $('<th />', {
			'class' : 'day'
		}).text(days[i]);
		cell.appendTo(row);
	}

	row.appendTo(table);

	// Other rows.
	for(i = 8; i < 22; i += 1) {
		row = $('<tr />', {
			'rel' : i
		});
		cell = $('<th />', {
			'rowspan' : '2',
			'class' : 'hour',
		}).text((i % 12 == 0) ? '12 PM' : i % 12 + ' ' +  (i >= 12 ? 'PM' : 'AM'));
		cell.appendTo(row);

		for(j = 0; j < days.length; j++) {
			cell = $('<td />', {
				'rel' : j
			});

			div = $('<div />').css({
				'position' : 'relative'
			});
			div.appendTo(cell);

			cell.appendTo(row);
		}

		row.appendTo(table);

		row = $('<tr />');

		for(j = 0; j < days.length; j++) {
			cell = $('<td />').appendTo(row);
		}

		row.appendTo(table);
	}

	this.dom_ = calendar;

	calendar.appendTo(element);
};

/**
 * @override
 */
CalendarView.prototype.onChildAdded_ = function(cv, view) {
	if(jslib.is(view, org.riceapps.scheduleplanner.views.DraggableCalendarItemView)
	|| jslib.is(view, org.riceapps.scheduleplanner.views.DroppableCalendarItemView)) {
		// Make the locations.
		var times = view.getTimes();
		var elements = [];
		var element, renderTarget, height, durationHours, startHour, offset;

		for(var i = 0; i < times.length; i++) {
			// start end day
			durationHours = times[i]['end'] - times[i]['start'];
			startHour = Math.floor(times[i]['start']);
			// TODO(rounding for things that dont start on even hours, plus a margin)


			element = $(this.dom_).find('tr[rel=' + startHour + '] td[rel=' + times[i]['day'] + '] div')[0];
			height = (($(element).closest('td').height()) * durationHours * 2) + (durationHours * 2);
			offset = (times[i]['start'] - startHour) * (2 * ($(element).closest('td').height()+2));
			/*window.console.log({
				"start" : times[i]['start'],
				"end" : times[i]['end'],
				"td_height" : $(element).closest('td').height(),
				"start_hour" : startHour,
				"offset" : offset,
				"height" : height
			});*/
			renderTarget = $('<div />', {
				'class' : 'calendar_target'
			}).css({
				'position' : 'absolute',
				'z-index' : jslib.is(view,org.riceapps.scheduleplanner.views.DraggableCalendarItemView) ? 4 : 2,
				'top' : offset + 'px',
				'left' : '0px',
				'width' : $(element).closest('td').width() - 1 + 'px',
				'height' : height + 'px'
			});
			renderTarget.appendTo(element);
			elements.push(renderTarget);
		}

		// Render the view inside of them.
		view.renderIn(elements);
	}
};

/**
 * @override
 */
CalendarView.prototype.onChildRemoved_ = function(cv, view) {
};

CalendarView.prototype.onResize_ = function(event) {
	$(this.dom_).find('.calendar_target').each(function(i,element){
		$(element).css('width', $(element).closest('td').width() - 1 + 'px');
	});
};

});