/**
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.views.ModalView');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.views.View}
 */
org.riceapps.scheduleplanner.views.ModalView = function() {
	this.superConstructor();

	/** @private {?Element} */
	this.dom_ = null;

	/** @private {Element|string} */
	this.content_ = null;

	/** @private {string} */
	this.title_ = null;

	this.bindEvent(window, 'resize', this.onResize_);
	this.bindEvent(document, 'keyup', this.onKeyRelease_);

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.views.ModalView,
	           org.riceapps.scheduleplanner.views.View);
var ModalView = org.riceapps.scheduleplanner.views.ModalView;

/** @enum {string} */
ModalView.Event = {
	CLOSED : 'closed'
};

ModalView.prototype.renderIn = function(element) {
	var overlay = $('<div />', {
		'class' : 'modal_overlay'
	}).hide();

	var modal = $('<div />', {
		'class' : 'modal'
	}).css({
		'height' : (0.8 * $(window).height()) + 'px',
		'width' : (0.8 * $(window).width()) + 'px',
		'top' : (0.1 * $(window).height()) + 'px',
		'left' : (0.1 * $(window).width()) + 'px',
	});

	var close = $('<div />', {
		'class' : 'close'
	});

	this.bindEvent(overlay, 'click', this.onClick_);
	this.bindEvent(close, 'click', this.onCloseClick_);

	modal.appendTo(overlay);
	close.appendTo(modal);
	this.dom_ = overlay;
	$(overlay).appendTo(element);
	this.show();
};

ModalView.prototype.show = function() {
	if(!this.dom_) {
		this.renderIn(document.body);
	}

	$(this.dom_).fadeIn("slow");
};

ModalView.prototype.hide = function() {
	if(this.dom_) {
		var thisObject = this;
		$(this.dom_).fadeOut("slow", function() {
			thisObject.notify(ModalView.Event.CLOSED);
		});
	}
};

ModalView.prototype.onResize_ = function() {
	if(this.dom_) {
		$(this.dom_).find('.modal').css({
			'height' : (0.8 * $(window).height()) + 'px',
			'width' : (0.8 * $(window).width()) + 'px',
			'top' : (0.1 * $(window).height()) + 'px',
			'left' : (0.1 * $(window).width()) + 'px',
		});
	}
};

ModalView.prototype.onKeyRelease_ = function(event) {
	// If the key is escape, then close the window.
	if(event.keyCode == 27) {
		this.hide();
	}
};

ModalView.prototype.onClick_ = function(event) {
	var modal = $(this.dom_).find('.modal')[0];
	var contained = $.contains(modal, event.target) || event.target === modal;
	if(!contained) {
		this.hide();	
	}
};

ModalView.prototype.onCloseClick_ = function(event) {
	this.hide();
};

/**
 * @override
 */
ModalView.prototype.destroy = function() {
	this.super('destroy');
	$(this.dom_).remove();
	this.dom_ = null;
};

});