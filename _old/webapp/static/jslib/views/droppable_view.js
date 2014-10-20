/**
 * @author Matthew Schurr (mschurr@rice.edu)
 */

jslib.provides('org.riceapps.scheduleplanner.views.DroppableView');


jslib.scope(function(){
var DraggableView = org.riceapps.scheduleplanner.views.DraggableView;

// Constructor
org.riceapps.scheduleplanner.views.DroppableView = function() {
	this.superConstructor();

	/** @private {?Element} */
	this.dom_ = null;

	/** @private {!Array.<org.riceapps.scheduleplanner.views.DraggableView>} */
	this.accepted_ = [];

	/** @protected {!Array.<org.riceapps.scheduleplanner.views.DraggableView>} */
	this.activeDrag_ = null;

	this.bindEvent(window, 'resize', this.onResize_);

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.views.DroppableView,
	           org.riceapps.scheduleplanner.views.View);
var DroppableView = org.riceapps.scheduleplanner.views.DroppableView;

// Constants
/** @enum {string} */
DroppableView.Event = {
	DROPPED : 'ondrop'
};

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
	if(this.activeDrag_) {
		event.preventDefault();
		$(this.dom_).addClass("hovered").removeClass("active");
	}
};

/**
 * Called when an item is no longer being dragged over the view.
 */
DroppableView.prototype.onDragLeave_ = function(event) {
	if(this.activeDrag_) {
		$(this.dom_).removeClass("hovered").removeClass("active");
	}
};

/**
 * Called when an item is being dragged over the view.
 */
DroppableView.prototype.onDragOver_ = function(event) {
	if(this.activeDrag_) {
		event.preventDefault();
	}
};

/**
 * Called when an item is dropped onto the view.
 * Note that onDragLeave_ is not called.
 */
DroppableView.prototype.onDrop_ = function(event) {
	var view = this.activeDrag_;
	event.preventDefault();
	$(this.dom_).removeClass("hovered").addClass("active");

	var dom = this.dom_;
	window.setTimeout(function(){
		$(dom).removeClass("active");
	}, 400);

	this.notify(DroppableView.Event.DROPPED, view);
	this.activeDrag_ = null;
};

/**
 * Called when a target starts being dragged.
 */
DroppableView.prototype.onTargetDragStart_ = function(view) {
	this.activeDrag_ = view;
};

/**
 * Called when a target stops being dragged.
 */
DroppableView.prototype.onTargetDragEnd_ = function(view) {
	this.activeDrag_ = null;
};

/**
 * Indicates that this droppable accepts drops from a draggable view.
 * @param {org.riceapps.scheduleplanner.views.DraggableView} view
 */
DroppableView.prototype.accepts = function(view) {
	this.subscribe(view, DraggableView.Event.DRAG_STARTED, this.onTargetDragStart_);
	this.subscribe(view, DraggableView.Event.DRAG_ENDED, this.onTargetDragEnd_);
	this.accepted_.push(view);
};

/**
 * Clears all targets gained through accepts().
 */
DroppableView.prototype.clearTargets = function() {
	this.accepted = [];
};

DroppableView.prototype.onResize_ = function(event) {
	if(this.dom_) {
		this.dom_.css({
			'width' : $(this.dom_).parent().width() + 'px',
			'height' : $(this.dom_).parent().height() + 'px',
		});
	}
};

});