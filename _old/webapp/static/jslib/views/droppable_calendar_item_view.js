/**
 * Acts a placement guide when dragging from playground into calendar, or when
 * picking an item up off of the calendar.
 * @author Matthew Schurr (mschurr@rice.edu)
 */

jslib.provides('org.riceapps.scheduleplanner.views.DroppableCalendarItemView');

jslib.scope(function(){

/**
 * @constructor
 * @param {!number} courseId
 * @param {!string} title
 * @param {!Array.<Object>} times
 */
org.riceapps.scheduleplanner.views.DroppableCalendarItemView = function(courseId, title, times) {
	this.superConstructor();

	/** @protected {?Array.<Element>} */
	this.domElements_ = null;

	/** @protected {!Array.<Object>} */
	this.times_ = times;

	/** @protected {!number} */
	this.courseId_ = courseId;

	/** @protected {!string} */
	this.title_ = title;
};
jslib.inherits(org.riceapps.scheduleplanner.views.DroppableCalendarItemView,
	           org.riceapps.scheduleplanner.views.DroppableView);
var DroppableCalendarItemView = org.riceapps.scheduleplanner.views.DroppableCalendarItemView;

/**
 * @return {!number}
 */
DroppableCalendarItemView.prototype.getCourseId = function() {
	return this.courseId_;
};

/**
 * @return {!string}
 */
DroppableCalendarItemView.prototype.getTitle = function() {
	return this.title_;
};

/**
 * @return {!Array.<Object>}
 */
DroppableCalendarItemView.prototype.getTimes = function() {
	return this.times_;
};

/**
 * @override
 * @parameter {!Array.<Element>} elements
 */
DroppableCalendarItemView.prototype.renderIn = function(elements) {
	if(this.domElements_ != null) {
		for(var i = 0; i < this.domElements_.length; i++) {
			$(this.domElements_[i]).remove();
		}
		this.domElements_ = null;
	}

	this.domElements_ = [];

	for(var i = 0; i < elements.length; i++) {
		var e = $('<div />').css({
			'position' : 'relative'
		});

		var e2 = $('<div />', {
			'class' : 'droppable'
		});

		e2.css({
			'width' : $(elements[i]).width() + 'px',
			'height' : $(elements[i]).height() + 'px',
			'position' : 'absolute',
			'border-radius' : '8px',
			'top' : 0,
			'left' : 0
		});

		e2.appendTo(e);

		this.bindEvent(e2, 'dragenter', this.onDragEnter_);
		this.bindEvent(e2, 'dragleave', this.onDragLeave_);
		this.bindEvent(e2, 'dragover',  this.onDragOver_);
		this.bindEvent(e2, 'drop',      this.onDrop_);
		e.appendTo(elements[i]);
		this.domElements_.push(e);
	}
};

/**
 * @override
 */
DroppableCalendarItemView.prototype.onDragEnter_ = function(event) {
	this.super('onDragEnter_', event);

	if(this.activeDrag_) {
		for(var i = 0; i < this.domElements_.length; i++) {
			$(this.domElements_[i]).find('.droppable').addClass("hovered").removeClass("active");
		}
	}
};

/**
 * @override
 */
DroppableCalendarItemView.prototype.onDragLeave_ = function(event) {
	this.super('onDragLeave_', event);

	if(this.activeDrag_) {
		for(var i = 0; i < this.domElements_.length; i++) {
			$(this.domElements_[i]).find('.droppable').removeClass("hovered").removeClass("active");
		}
	}
};

/**
 * @override
 */
DroppableCalendarItemView.prototype.onDrop_ = function(event) {
	this.super('onDrop_', event);
	/*
	for (var i = 0; i < this.domElements_.length; i++) {
		$(this.domElements_[i]).find('.droppable').removeClass("hovered").addClass("active");
	}

	var domElements = this.domElements_;

	window.setTimeout(function(){
		for (var i = 0; i < domElements.length; i++) {
			$(domElements[i]).find('.droppable').removeClass("hovered").addClass("active");
		}
	}, 400);*/
};

/**
 * @override
 */
DroppableCalendarItemView.prototype.destroy = function() {
	if(this.domElements_ != null) {
		for(var i = 0; i < this.domElements_.length; i++) {
			$(this.domElements_[i]).closest('.calendar_target').remove();
			$(this.domElements_[i]).remove();
		}
		this.domElements_ = null;
	}
};

});