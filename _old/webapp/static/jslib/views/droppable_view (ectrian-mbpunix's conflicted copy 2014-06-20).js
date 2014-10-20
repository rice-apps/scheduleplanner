/**
 * @author Matthew Schurr (mschurr@rice.edu)
 */

// Provides
jslib.provides('org.riceapps.scheduleplanner.views.DroppableView');

// Requires
//jslib.require('org.riceapps.scheduleplanner.views.View');

jslib.scope(function(){
// Aliases

// Constructor
org.riceapps.scheduleplanner.views.DroppableView = function() {
	this.superConstructor();

	// Properties
	/** @private {?Element} */
	this.dom_ = null;

	/** @private {!Array.<org.riceapps.scheduleplanner.views.DraggableView>} */
	this.accepted_ = [];

	/** @private {Function} */
	this.dropHandler_ = null;

	/** @private {Object} */
	this.dropHandlerThis_ = window;

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.views.DroppableView,
	           org.riceapps.scheduleplanner.views.View);
var DroppableView = org.riceapps.scheduleplanner.views.DroppableView;

// Constants

// Methods
DroppableView.prototype.renderIn = function(element) {
	this.dom_ = $('<div />', {
		'class' : 'droppable',
	});

	this.dom_.css({
		'width' : $(element).parent().width() + 'px',
		'height' : $(element).parent().height() + 'px',
	});

	this.dom_.appendTo(element);

	this.bindEvent(this.dom_, 'dragenter', this.onDragEnter_);
	this.bindEvent(this.dom_, 'dragleave', this.onDragLeave_);
	this.bindEvent(this.dom_, 'dragover',  this.onDragOver_);
	this.bindEvent(this.dom_, 'drop',      this.onDrop_);
};

/**
 * Called when an item is first dragged over the view.
 */
DroppableView.prototype.onDragEnter_ = function(event) {
	var view = this.getViewFromEvent_(event);

	window.console.log('dragEnter');
	event.preventDefault();

	if (view) {
		$(this.dom_).addClass("hovered").removeClass("active");
	}
};

/**
 * Called when an item is no longer being dragged over the view.
 */
DroppableView.prototype.onDragLeave_ = function(event) {
	var view = this.getViewFromEvent_(event);

	window.console.log('dragLeave');

	if (view) {
		$(this.dom_).removeClass("hovered").removeClass("active");
	}
};

/**
 * Called when an item is being dragged over the view.
 */
DroppableView.prototype.onDragOver_ = function(event) {
	var view = this.getViewFromEvent_(event);

	window.console.log('dragOver');

	window.console.log(event.originalEvent);

	if (view) {
		event.preventDefault();
	}
};

/**
 * Called when an item is dropped onto the view.
 * Note that onDragLeave_ is not called.
 */
DroppableView.prototype.onDrop_ = function(event) {
	event.preventDefault();
	$(this.dom_).removeClass("hovered").addClass("active");

	var view = this.getViewFromEvent_(event);
};

/**
 * @param {Event} event
 * @return {?org.riceapps.scheduleplanner.views.DraggableView}
 */
DroppableView.prototype.getViewFromEvent_ = function(event) {
	return null;
	//window.console.log('checking');
	for (var i = 0; i < this.accepted_.length; i++) {
		var view = this.accepted_[i];

		//window.console.log(view);
		//window.console.log(event.target);

		if(view.contains(event.target)) {
			return view;
		}
	}

	return null;
}

/**
 * Indicates that this droppable accepts drops from a draggable view.
 * @param {org.riceapps.scheduleplanner.views.DraggableView} view
 */
DroppableView.prototype.accepts = function(view) {
	this.accepted_.push(view);
};

/**
 * Clears all targets gained through accepts().
 */
DroppableView.prototype.clearTargets = function() {
	this.accepted = [];
};

});