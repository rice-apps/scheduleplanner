goog.provide('org.riceapps.views.CRNView');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.dom.TagName');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('org.riceapps.views.ModalView');
goog.require('org.riceapps.views.View');

goog.scope(function() {
	
/**
 * @extends {org.riceapps.views.ModalView}
 * @constructor
 */
org.riceapps.views.CRNView = function() {
  goog.base(this);

};
goog.inherits(org.riceapps.views.CRNView,
              org.riceapps.views.View);
var CRNView = org.riceapps.views.CRNView;

var UserModel = org.riceapps.models.UserModel;
/**
 * @enum {string}
 */
CRNView.Theme = {
  BASE: 'crn-view',
  BASE_HOVER: 'crn-view-hover',
};


/**
 * @override
 */
CRNView.prototype.createDom = function() {

  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CRNView.Theme.BASE);

};
}); // goog.scope
