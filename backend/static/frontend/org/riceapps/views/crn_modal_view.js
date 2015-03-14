goog.provide('org.riceapps.views.CRNModalView');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.dom.TagName');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('org.riceapps.views.ModalView');


goog.scope(function() {

/**
 * @param {!org.riceapps.models.UserModel} userModel
 * @extends {org.riceapps.views.ModalView}
 * @constructor
 */
org.riceapps.views.CRNModalView = function(userModel) {
  goog.base(this);

  /** @private {!org.riceapps.models.UserModel} */
  this.userModel_ = userModel;

};
goog.inherits(org.riceapps.views.CRNModalView,
              org.riceapps.views.ModalView);
var CRNModalView = org.riceapps.views.CRNModalView;

/** @enum {string} */
CRNModalView.Theme = {
  BASE: 'crn-modal-view',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
  CONTAINER: 'container',
  TEXT: 'text'
};


/**
 * @override
 */
CRNModalView.prototype.createDom = function() {
  // College
  // Department
  // School
  // Session
  // Grade Mode
  // Last Update

  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CRNModalView.Theme.BASE);
  
  var element, i, crn, coursename, courses;
	
  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.TITLE);
  goog.dom.setTextContent(element, 'CRNs');
  goog.dom.appendChild(this.getElement(), element);
  
  var container = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.CONTAINER);
  goog.dom.appendChild(this.getElement(), container);
  
  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.SUBTITLE);
  goog.dom.setTextContent(element, 'CRNs in Schedule');
  goog.dom.appendChild(container, element);
  
  courses = this.userModel_.getCoursesInSchedule();

  for (i=0; i<courses.length; i++) {
	  
	  crn = courses[i].getCrn();
	  coursename = courses[i].getCourseCategory();
	  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.TEXT);
	  goog.dom.setTextContent(element, crn);
	  goog.dom.appendChild(container, element);
	}
  
  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.SUBTITLE);
  goog.dom.setTextContent(element, 'CRNs in Drawer');
  goog.dom.appendChild(container, element);
  
  courses = this.userModel_.getCoursesInPlayground();

  for (i=0; i<courses.length; i++) {
	  
	  crn = courses[i].getCrn();
	  coursename = courses[i].getCourseCategory();
	  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.TEXT);
	  goog.dom.setTextContent(element, crn);
	  goog.dom.appendChild(container, element);
	}
  
  

};

});  // goog.scope