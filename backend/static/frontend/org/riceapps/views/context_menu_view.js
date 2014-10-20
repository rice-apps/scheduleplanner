goog.provide('org.riceapps.views.ContextMenuView');

goog.require('goog.dom');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('org.riceapps.views.View');

goog.scope(function() {



/**
 * @param {!Element} trigger
 * @extends {org.riceapps.views.ContextMenuView}
 * @constructor
 */
org.riceapps.views.ContextMenuView = function(trigger) {
  goog.base(this);

  /** @private {!Element} */
  this.trigger_ = trigger;
};
goog.inherits(org.riceapps.views.ContextMenuView,
              org.riceapps.views.View);
var ContextMenuView = org.riceapps.views.ContextMenuView;


/**
 * @override
 */
ContextMenuView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * @override
 */
ContextMenuView.prototype.exitDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * @override
 */
ContextMenuView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);
};

});  // goog.scope
