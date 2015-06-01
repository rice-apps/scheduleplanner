/**
 * A simple view that provides a navigation bar.
 */
goog.provide('org.riceapps.views.NavigationBarView');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('org.riceapps.views.View');

goog.scope(function() {



/**
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.NavigationBarView = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.views.NavigationBarView,
              org.riceapps.views.View);
var NavigationBarView = org.riceapps.views.NavigationBarView;


/** @enum {string} */
NavigationBarView.Theme = {
  BASE: 'navigation-bar-view'
};


/**
 * @override
 */
NavigationBarView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), NavigationBarView.Theme.BASE);

  // NOTE: Currently, this view is unused.
  goog.style.setElementShown(this.getElement(), false);
};


/**
 * @override
 */
NavigationBarView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('NavigationBarView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};

}); // goog.scope
