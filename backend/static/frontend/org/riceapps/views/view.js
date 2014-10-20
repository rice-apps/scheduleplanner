goog.provide('org.riceapps.views.View');

goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('goog.ui.Component');

goog.scope(function() {



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
 * @param {!goog.events.BrowserEvent}
 */
View.prototype.handleWindowResize_ = function(event) {
  if (this.getParent()) {
    return;
  }

  this.relayout(true);
}


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

});  // goog.scope
