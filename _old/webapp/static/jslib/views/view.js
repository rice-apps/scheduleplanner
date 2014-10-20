/**
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.views.View');

jslib.scope(function(){

/**
 * @extends {org.riceapps.scheduleplanner.JSObject}
 * @constructor
 */
org.riceapps.scheduleplanner.views.View = function() {
	this.superConstructor();

	/** @private {!Array.<org.riceapps.scheduleplanner.views.View>} */
	this.childViews_ = [];

	/** @private {?org.riceapps.scheduleplanner.views.View} */
	this.parent_ = null;

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.views.View,
	           org.riceapps.scheduleplanner.JSObject);
var View = org.riceapps.scheduleplanner.views.View;

/* @enum {string} */
View.Event = {
	DESTROYED: 'destroy',            // @function(view)
	CHILD_ADDED : 'childadded',      // @function(view, child)
	CHILD_REMOVED : 'childremoved',  // @function(view, child)
	PARENT_CHANGED : 'parentchanged' // @function(view, newParent, oldParent)
};

/**
 * Renders the view inside of a target element(s), destroying the
 *  view in any places it was previously rendered.
 * @param {!Element|!Array.<!Element>} target
 */
View.prototype.renderIn = function(target) {
	window.console.log("View.renderIn was not overridden.");
	return;
};

/**
 * Destroys the view and its children.
 */
View.prototype.destroy = function() {
	//window.console.log('View.destroy', this.parent_, this.childViews_);
	// Inform the parent that this view no longer exists.
	this.setParent(null);

	// Destroy all of this view's children.
	for(var i = 0; i < this.childViews_.length; i++) {
		this.childViews_[i].destroy();
	}

	this.notify(View.Event.DESTROYED);
};

/**
 * Returns the view's parent view.
 */
View.prototype.getParent = function(view) {
	return this.parent_;
};

/**
 * Adds a child view.
 * @param {View} view
 */
View.prototype.addChild = function(view) {
	//window.console.log('View.addChild');
	this.addChildInternal_(view, true);
};

/**
 * Removes a child view.
 * @param {View} view
 */
View.prototype.removeChild = function(view) {
	//window.console.log('View.removeChild');
	this.removeChildInternal_(view, true);
};

/**
 * Sets this view's parent.
 * @param {?View} view
 */
View.prototype.setParent = function(view) {
	//window.console.log('View.setParent');
	this.setParentInternal_(view, true);
};

/**
 * Binds events an event to a callback.
 * @param {!Element} element
 * @param {string} eventType
 * @param {Function(Event,?Object)} handler
 * @param {Object=} opt_data
 */
View.prototype.bindEvent = function(element, eventType, handler, opt_data) {
	var thisObject = this;
	$(element).on(eventType, opt_data, function(event){
		if(opt_data) {
			handler.call(thisObject, event, opt_data);
		} else {
			handler.call(thisObject, event);
		}
	});
};

/**
 * @param {View} view
 * @param {boolean} propogate
 * @private
 */
View.prototype.setParentInternal_ = function(view, propogate) {
	//window.console.log("View.setParentInternal_(p="+propogate+")");
	var oldParent = this.parent_;

	// Inform the parent.
	if(this.parent_) {
		this.parent_.removeChildInternal_(this, false);	
	}

	// Update local state.
	this.parent_ = view;

	// Add this view as a child of the new parent.
	if(propogate && this.parent_) {
		this.parent_.addChildInternal_(this, false);
	}

	// Notify observers.
	this.notify(View.Event.PARENT_CHANGED, view, oldParent);
};

/**
 * @param {View} view
 * @param {boolean} propogate
 * @private
 */
View.prototype.addChildInternal_ = function(view, propogate) {
	//window.console.log("View.addChildInternal_(p="+propogate+")");
	// Update local state.
	this.childViews_.push(view);

	// Inform the view that it has a new parent.
	if(propogate) {
		view.setParentInternal_(this, false);
	}

	// Notify observers.
	this.notify(View.Event.CHILD_ADDED, view);
};

/**
 * @param {View} view
 * @param {boolean} propogate
 * @private
 */
View.prototype.removeChildInternal_ = function(view, propogate) {
	//window.console.log("View.removeChildInternal_(p="+propogate+")");
	for(var i = 0; i < this.childViews_.length; i++) {
		if(this.childViews_[i] === view) {
			// Update local state.
			this.childViews_.splice(i, 1);

			// Inform the child that it no longer has a parent.
			if(propogate) {
				view.setParentInternal_(null, false);
			}

			// Notify observers.
			this.notify(View.Event.CHILD_REMOVED, view);

			break;
		}
	}
};

/**
 * Returns the view's children.
 * @return {!Array.<!View>}
 */
View.prototype.getChildren = function() {
	return this.childViews_;
};

});