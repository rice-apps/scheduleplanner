/**
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.views.TrashView');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.views.DroppableView}
 */
org.riceapps.scheduleplanner.views.TrashView = function() {
	this.superConstructor();

	/** @private {?Element} */
	this.trashDom_ = null;

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.views.TrashView,
			  org.riceapps.scheduleplanner.views.DroppableView);
var TrashView = org.riceapps.scheduleplanner.views.TrashView;

/**
 * @override
 */
TrashView.prototype.renderIn = function(target) {
	if(this.trashDom_) {
		this.trashDom_.remove();
	}

	this.trashDom_ = $('<div />', {
		'class' : 'trash'
	});


	this.bindEvent(this.trashDom_, 'dragenter', this.onDragEnter_);
	this.bindEvent(this.trashDom_, 'dragleave', this.onDragLeave_);
	this.bindEvent(this.trashDom_, 'dragover',  this.onDragOver_);
	this.bindEvent(this.trashDom_, 'drop',      this.onDrop_);

	this.trashDom_.appendTo(target);
};


/**
 * @override
 */
TrashView.prototype.onDragEnter_ = function(event) {
	this.super('onDragEnter_', event);
	if(this.activeDrag_) {
		$(this.trashDom_).addClass("hovered");
	}
};

/**
 * @override
 */
TrashView.prototype.onDragLeave_ = function(event) {
	this.super('onDragLeave_', event);
	if(this.activeDrag_) {
		$(this.trashDom_).removeClass("hovered");
	}
};

/**
 * @override
 */
TrashView.prototype.onDrop_ = function(event) {
	this.super('onDrop_', event);
	$(this.trashDom_).removeClass("hovered");
};

});