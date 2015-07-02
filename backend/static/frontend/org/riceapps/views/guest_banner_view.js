/**
 * A simple view that provides a navigation bar.
 */
goog.provide('org.riceapps.views.GuestBannerView');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('org.riceapps.views.View');

goog.scope(function() {



/**
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.GuestBannerView = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.views.GuestBannerView,
              org.riceapps.views.View);
var GuestBannerView = org.riceapps.views.GuestBannerView;


/** @enum {string} */
GuestBannerView.Theme = {
  BASE: 'guest-banner-view',
  WARNING_BAR: 'bar-warning'
};


/**
 * @override
 */
GuestBannerView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), GuestBannerView.Theme.BASE);

  var warning = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(warning, GuestBannerView.Theme.WARNING_BAR);
  goog.dom.setTextContent(warning, 'You are not logged in. Your schedule and preferences will not be saved ' +
      'and certain features may be unavailable.');
  goog.dom.appendChild(this.getElement(), warning);

  goog.style.setElementShown(this.getElement(), false);
};


/**
 * @override
 */
GuestBannerView.prototype.show = function(opt_preventAnimation) {
  goog.base(this, 'show', opt_preventAnimation);
  goog.style.setElementShown(this.getElement(), true);
};


/**
 * @override
 */
GuestBannerView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('GuestBannerView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};

}); // goog.scope
