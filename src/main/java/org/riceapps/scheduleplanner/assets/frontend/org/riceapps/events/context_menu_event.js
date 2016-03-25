/**
 * A custom event fired by various actions on an org.riceapps.views.ContextMenuView.
 */

goog.provide('org.riceapps.events.ContextMenuEvent');
goog.provide('org.riceapps.events.ContextMenuEvent.Type');

goog.require('goog.events.Event');

goog.scope(function() {



/**
 * @param {ContextMenuEvent.Type} type
 * @param {number=} opt_optionId
 * @extends {goog.events.Event}
 * @constructor
 */
org.riceapps.events.ContextMenuEvent = function(type, opt_optionId) {
  goog.base(this, type);

  /** @private {number} */
  this.optionId_ = opt_optionId || 0;
};
goog.inherits(org.riceapps.events.ContextMenuEvent,
              goog.events.Event);
var ContextMenuEvent = org.riceapps.events.ContextMenuEvent;


/** @enum {string} */
ContextMenuEvent.Type = {
  OPEN: 'cme_opened',
  CLOSE: 'cme_closed',
  OPTION_CLICK: 'cme_option_click' // has optionId attached.
};


/**
 * @return {number}
 */
ContextMenuEvent.prototype.getOptionId = function() {
  return this.optionId_;
};

});  // goog.scope
