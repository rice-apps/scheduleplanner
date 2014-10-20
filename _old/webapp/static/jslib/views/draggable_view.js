/**
 * @author Matthew Schurr (mschurr@rice.edu)
 */

// Provides
jslib.provides('org.riceapps.scheduleplanner.views.DraggableView');

// Requires
//jslib.require('org.riceapps.scheduleplanner.views.View');

jslib.scope(function(){
// Aliases

// Constructor
org.riceapps.scheduleplanner.views.DraggableView = function() {
	//window.console.log("DraggableView.enter");
	this.superConstructor();
	//window.console.log("DraggableView");

	// Properties
	/** @private {?Element} */
	this.dom_ = null;

	/** @private {!Array.<org.riceapps.scheduleplanner.views.View>} targets */
	this.targets_ = [];

	// Initialization
};
jslib.inherits(org.riceapps.scheduleplanner.views.DraggableView,
	           org.riceapps.scheduleplanner.views.View);
var DraggableView = org.riceapps.scheduleplanner.views.DraggableView;

// Constants
/** @enum {string} */
DraggableView.Event = {
	CLICKED: 'clicked',
	DRAG_STARTED : 'dragstarted',
	DRAG_ENDED : 'dragended',
	DRAGGED : 'dragged'
};

// Methods
DraggableView.prototype.renderIn = function(element) {
	if(this.dom_) {
		$(this.dom_).remove();
	}

	this.dom_ = $('<div />', {
		'class' : 'draggable',
		'draggable' : 'true',
	}).text('Draggable Title');

	this.bindEvent(this.dom_, 'dragstart', this.onDragStart_);
	this.bindEvent(this.dom_, 'dragend',   this.onDragEnd_);
	this.bindEvent(this.dom_, 'drag',      this.onDrag_);
	this.bindEvent(this.dom_, 'click',     this.onClick_);

	this.dom_.appendTo(element);
};


/**
 * Fired when the user starts dragging the view.
 */
DraggableView.prototype.onDragStart_ = function(event) {
	event.originalEvent.dataTransfer.setData('text/plain', 'unused');
	event.originalEvent.dataTransfer.effectAllowed = 'move';
	event.originalEvent.dataTransfer.dropEffect = 'move';
	this.notify(DraggableView.Event.DRAG_STARTED);
};

/**
 * Fired when the drag operation ends, whether successful or not.
 */
DraggableView.prototype.onDragEnd_ = function(event) {
	this.notify(DraggableView.Event.DRAG_ENDED);
};

/**
 * Fired at the source of the drag while the view is being dragged.
 */
DraggableView.prototype.onDrag_ = function(event) {
	this.notify(DraggableView.Event.DRAGGED);
};


/**
 * Fired when the handle is clicked on.
 */
DraggableView.prototype.onClick_ = function(event) {
	this.notify(DraggableView.Event.CLICKED);
};

});