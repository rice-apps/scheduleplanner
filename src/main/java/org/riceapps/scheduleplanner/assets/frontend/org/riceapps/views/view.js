/**
 * Provides a generic implementation of a View.
 * All other views should inherit from this class.
 */

goog.provide('org.riceapps.views.View');

goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('org.riceapps.events.ViewEvent');
goog.require('org.riceapps.events.ViewEvent.Type');

goog.scope(function() {
var ViewEvent = org.riceapps.events.ViewEvent;



/**
 * @extends {goog.ui.Component}
 * @constructor
 */
org.riceapps.views.View = function() {
  goog.base(this);

  /** @private {!goog.events.EventHandler} */
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventHandler_);

  /** @private {boolean} */
  this.isShown_ = true;

  /** @private {boolean} */
  this.hasRelayoutListener_ = false;
};
goog.inherits(org.riceapps.views.View,
              goog.ui.Component);
var View = org.riceapps.views.View;


/**
 * Returns an event handler whose scope is the view.
 * @return {!goog.events.EventHandler}
 */
View.prototype.getHandler = function() {
  return this.eventHandler_;
};


/**
 * @override
 */
View.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (!this.getParent()) {
    this.eventHandler_.listen(window, goog.events.EventType.RESIZE, this.handleWindowResize_);
    this.hasRelayoutListener_ = true;
  }
};


/**
 * @override
 */
View.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  if (this.hasRelayoutListener_) {
    this.eventHandler_.unlisten(window, goog.events.EventType.RESIZE, this.handleWindowResize_);
    this.hasRelayoutListener_ = false;
  }
};


/**
 * @override
 */
View.prototype.setParent = function(parent) {
  goog.base(this, 'setParent', parent);

  if (parent == null && this.hasRelayoutListener_) {
    this.eventHandler_.unlisten(window, goog.events.EventType.RESIZE, this.handleWindowResize_);
    this.hasRelayoutListener_ = false;
  } else if (!this.hasRelayoutListener_) {
    this.eventHandler_.listen(window, goog.events.EventType.RESIZE, this.handleWindowResize_);
    this.hasRelayoutListener_ = true;
  }
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
View.prototype.handleWindowResize_ = function(event) {
  if (this.getParent()) {
    return;
  }

  this.relayout(true);
};


/**
 * Informs the view that its dimensions may have changed and that it should re-calculate its layout.
 * IMPORTANT: You should always re-calculate the layout of the current view before calling the base-class relayout,
 * which triggers relayout on the children.
 * @param {?boolean=} opt_preventAnimation
 */
View.prototype.relayout = function(opt_preventAnimation) {
  for (var i = 0; i < this.getChildCount(); i++) {
    this.getChildAt(i).relayout(opt_preventAnimation);
  }
};


/**
 * @param {?boolean=} opt_preventAnimation
 */
View.prototype.show = function(opt_preventAnimation) {
  this.isShown_ = true;
};


/**
 * @param {?boolean=} opt_preventAnimation
 */
View.prototype.hide = function(opt_preventAnimation) {
  this.isShown_ = false;
};


/**
 * @return {boolean}
 */
View.prototype.isHidden = function() {
  return !this.isShown_;
};


/**
 * @return {boolean}
 */
View.prototype.isShown = function() {
  return this.isShown_;
};


/**
 * Removes all children who satisfy the closure optionally unrendering them and returns a list of the children removed.
 * @param {function(this:SCOPE, !org.riceapps.views.View): boolean} shouldRemove Function which indicates if given child should be removed
 * @param {boolean=} opt_unrender Whether to unrender the view
 * @param {SCOPE=} opt_scope Scope in which to execute comparator shouldRemove
 * @return {!Array.<!org.riceapps.views.View>} List of children removed
 * @template SCOPE
 */
View.prototype.removeChildrenIf = function(shouldRemove, opt_unrender, opt_scope) {
  var toRemove = [];
  var scope = opt_scope || window;

  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);

    if (child instanceof View && shouldRemove.call(scope, child)) {
      toRemove.push(child);
    }
  }

  for (var i = 0; i < toRemove.length; i++) {
    this.removeChild(toRemove[i], opt_unrender);
  }

  return toRemove;
};


/**
 * @override
 */
View.prototype.removeChild = function(child, opt_unrender) {
  var component = goog.base(this, 'removeChild', child, opt_unrender);
  this.dispatchEvent(new ViewEvent(ViewEvent.Type.CHILD_REMOVED));
  return component;
};


/**
 * @override
 */
View.prototype.removeChildAt = function(index, opt_unrender) {
  var component = goog.base(this, 'removeChildAt', index, opt_unrender);
  this.dispatchEvent(new ViewEvent(ViewEvent.Type.CHILD_REMOVED));
  return component;
};


/**
 * @override
 */
View.prototype.removeChildren = function(opt_unrender) {
  var components = goog.base(this, 'removeChildren', opt_unrender);
  this.dispatchEvent(new ViewEvent(ViewEvent.Type.CHILD_REMOVED));
  return components;
};


/**
 * @override
 */
View.prototype.addChild = function(child, opt_render) {
  goog.base(this, 'addChild', child, opt_render);
  this.dispatchEvent(new ViewEvent(ViewEvent.Type.CHILD_ADDED));
};


/**
 * @override
 */
View.prototype.addChildAt = function(child, index, opt_render) {
  goog.base(this, 'addChildAt', child, index, opt_render);
  this.dispatchEvent(new ViewEvent(ViewEvent.Type.CHILD_ADDED));
};


});  // goog.scope
