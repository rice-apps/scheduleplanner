/**
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.views.DraggableCalendarItemView');

jslib.scope(function(){
var DraggableView = org.riceapps.scheduleplanner.views.DraggableView;

/**
 * @constructor
 * @param {!number} courseId
 * @param {!string} title
 * @param {!Array.<Object>} times
 */
org.riceapps.scheduleplanner.views.DraggableCalendarItemView = function(courseId, title, times) {
	this.superConstructor();

	/** @private {?Array.<Element>} */
	this.domElements_ = null;

	/** @private {!number} */
	this.courseId_ = courseId;

	/** @private {!string} */
	this.title_ = title;

	/** @private {!Array.<Object>} */
	this.times_ = times;

	/** @protected {!Array.<View>} */
	this.guides_ = [];

	// Initialize
	this.bindEvent(window, 'resize', this.onResize_);
};
jslib.inherits(org.riceapps.scheduleplanner.views.DraggableCalendarItemView,
	           org.riceapps.scheduleplanner.views.DraggableView);
var DraggableCalendarItemView = org.riceapps.scheduleplanner.views.DraggableCalendarItemView;

/**
 * @return {!number}
 */
DraggableCalendarItemView.prototype.getCourseId = function() {
	return this.courseId_;
};

/**
 * @return {!string}
 */
DraggableCalendarItemView.prototype.getTitle = function() {
	return this.title_;
};

/**
 * @return {!Array.<Object>}
 */
DraggableCalendarItemView.prototype.getTimes = function() {
	return this.times_;
};

/**
 * Returns the guides bound to the view.
 * @return {Array.<View>}
 */
DraggableCalendarItemView.prototype.getGuides = function() {
	return this.guides_;
};

/**
 * Sets the view's guides.
 * @param {Array.<View>} guides
 */
DraggableCalendarItemView.prototype.setGuides = function(guides) {
	this.guides_ = guides;
};

/**
 * @override
 */
DraggableCalendarItemView.prototype.renderIn = function(elements) {
	if(this.domElements_ != null) {
		for(var i = 0; i < this.domElements_.length; i++) {
			$(this.domElements_[i]).remove();
		}
		this.domElements_ = null;
	}

	this.domElements_ = [];

	for(var i = 0; i < elements.length; i++) {
		var e = $('<div />', {
			'draggable' : 'true'
		});

		var ie = $('<div />', {
			'class' : 'draggable calendar',
			'rel' : 'data'
		});

		ie.text(this.title_);

		ie.css({
			'width' : $(elements[i]).width() + 'px',
			'height' : $(elements[i]).height() + 'px'
		});

		ie.appendTo(e);

		this.bindEvent(e, 'dragstart', this.onDragStart_);
		this.bindEvent(e, 'dragend',   this.onDragEnd_);
		this.bindEvent(e, 'drag',      this.onDrag_);
		this.bindEvent(e, 'click',     this.onClick_);
		e.appendTo(elements[i]);
		this.domElements_.push(e);
	}
};

/**
 * Redraws on resize.
 */
DraggableCalendarItemView.prototype.onResize_ = function(event) {
	if(this.domElements_) {
		for(var i = 0; i < this.domElements_.length; i++) {
			$(this.domElements_[i]).find('.draggable').css({
				'width' : $(this.domElements_[i]).parent().width() + 'px',
				'height' : $(this.domElements_[i]).parent().height() + 'px'
			});
		}
	}
};

/**
 *
 */
DraggableCalendarItemView.prototype.destroy = function() {
	this.super('destroy');

	if(this.domElements_ != null) {
		for(var i = 0; i < this.domElements_.length; i++) {
			$(this.domElements_[i]).closest('.calendar_target').remove();
			$(this.domElements_[i]).remove();
		}
		this.domElements_ = null;
	}
};

/**
 * @override
 */
DraggableCalendarItemView.prototype.onDragStart_ = function(event) {
	$('<div />', {
		'class' : 'draggable courseview',
		'rel' : 'handle'
	}).text(this.title_).css({
	}).appendTo(event.target);

	$(event.target).find('div[rel=data]').hide();

	this.super('onDragStart_', event);

	for(var i = 0; i < this.domElements_.length; i++) {
		//$(this.domElements_[i]).closest('.calendar_target').css('z-index', '1');
		this.domElements_[i].fadeOut("slow");
	}
};

/**
 * @override
 */
DraggableCalendarItemView.prototype.onDragEnd_ = function(event) {
	$(event.target).find('div[rel=handle]').remove();
	$(event.target).find('div[rel=data]').show();
	for(var i = 0; i < this.domElements_.length; i++) {
		//$(this.domElements_[i]).closest('.calendar_target').css('z-index', '4');
		this.domElements_[i].fadeIn("slow");
	}
	this.super('onDragEnd_', event);
};

});