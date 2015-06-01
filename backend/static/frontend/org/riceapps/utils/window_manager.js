/**
 * WindowManager helps track the stacking of pop-up windows.
 */

goog.provide('org.riceapps.utils.WindowManager');

goog.scope(function() {



/**
 * @constructor
 */
org.riceapps.utils.WindowManager = function() {
  /** @private {number} */
  this.zindex_current_ = 999;

  /** @private {!Array.<!org.riceapps.views.View>} */
  this.windows_ = [];
};
var WindowManager = org.riceapps.utils.WindowManager;


/** @type {org.riceapps.utils.WindowManager} */
WindowManager.SHARED_INSTANCE = null;


/**
 * Returns a singleton shared instance of WindowManager.
 * @return {!org.riceapps.utils.WindowManager}
 */
WindowManager.getSharedInstance = function() {
  if (WindowManager.SHARED_INSTANCE != null) {
    return WindowManager.SHARED_INSTANCE;
  }

  WindowManager.SHARED_INSTANCE = new WindowManager();
  return WindowManager.SHARED_INSTANCE;
};


/**
 * Pushes a window on to the stack of active windows.
 * @param  {!org.riceapps.views.View} win
 * @return {number}
 */
WindowManager.prototype.push = function(win) {
  window.console.log('WindowManager.push', win);
  goog.array.insert(this.windows_, win);
  this.zindex_current_ += 2;
  return this.zindex_current_;
};


/**
 * Removes a window from the stack of active windows.
 * @param  {!org.riceapps.views.View} win
 */
WindowManager.prototype.pop = function(win) {
  if (!goog.array.contains(this.windows_, win)) {
    return;
  }

  window.console.log('WindowManager.pop', win);
  goog.array.remove(this.windows_, win);
};


/**
 * Returns whether or not a given view is the active window.
 * @param {!org.riceapps.views.View} win
 * @return {boolean}
 */
WindowManager.prototype.isActiveWindow = function(win) {
  return goog.array.peek(this.windows_) === win;
};


});  // goog.scope
