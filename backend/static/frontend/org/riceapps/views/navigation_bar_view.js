goog.provide('org.riceapps.views.NavigationBarView');

goog.require('goog.dom.classlist');
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
};


/**
 * @override
 */
NavigationBarView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('NavigationBarView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};

}); // goog.scope
