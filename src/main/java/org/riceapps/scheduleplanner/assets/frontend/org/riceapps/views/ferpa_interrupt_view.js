/**
 * A simple view that requires the user to agree to some terms and conditions before being able to access
 * the application.
 */

goog.provide('org.riceapps.views.FerpaInterruptView');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.views.InterruptView');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



/**
 * @extends {org.riceapps.views.InterruptView}
 * @constructor
 */
org.riceapps.views.FerpaInterruptView = function() {
  goog.base(this);

  /** @private {Element} */
  this.agreeButton_ = null;
};
goog.inherits(org.riceapps.views.FerpaInterruptView,
              org.riceapps.views.InterruptView);
var FerpaInterruptView = org.riceapps.views.FerpaInterruptView;

/** @const {string} */
FerpaInterruptView.DISCLAIMER_TEXT = 'Schedule Planner is not affiliated with or endorsed by Rice University in any way. ' +
  'By using this application, you agree to grant the Rice Apps student organization permission to store information ' +
  'about you. You also acknowledge that the methods used by Rice Apps to store ' +
  'any of your information may not be compliant with the Family Educational Rights and Privacy Act (FERPA).';

/** @const {string} */
FerpaInterruptView.CONDITIONS_TEXT = 'Schedule Planner provides you with access to course evaluations. Course evaluations ' +
 'are intended to be available only to Rice students, faculty, ' +
 'and staff on Rice\'s internal computer network. Evaluation information should be considered confidential and is ' +
 'to be used solely by, within, and amongst the Rice University community and its members. Failure to follow this ' +
 'rule may result in your access to the evaluations being restricted or in other disciplinary action by the university.';

/** @enum {string} */
FerpaInterruptView.Theme = {
  BASE: 'schedule-planner-view-disclaimer',
  HEADER: 'schedule-planner-view-disclaimer-header'
};


/**
 * @override
 */
FerpaInterruptView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), FerpaInterruptView.Theme.BASE);

  var header = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(header, FerpaInterruptView.Theme.HEADER);
  goog.dom.setTextContent(header, 'Terms and Conditions');
  goog.dom.appendChild(this.getElement(), header);

  var element;
  element = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(element, FerpaInterruptView.DISCLAIMER_TEXT);
  goog.dom.appendChild(this.getElement(), element);

  element = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(element, FerpaInterruptView.CONDITIONS_TEXT);
  goog.dom.appendChild(this.getElement(), element);

  this.agreeButton_ = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'type': 'submit',
    'value': 'I Agree!'
  });
  goog.dom.appendChild(this.getElement(), this.agreeButton_);


  element = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(element, 'clear');
  goog.dom.appendChild(this.getElement(), element);
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
FerpaInterruptView.prototype.onAgreeClick_ = function(event) {
  this.hide();
  this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.AGREE_DISCLAIMER));
};


/**
 * @override
 */
FerpaInterruptView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(this.agreeButton_, goog.events.EventType.CLICK, this.onAgreeClick_);
};


/**
 * @override
 */
FerpaInterruptView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().
    unlisten(this.agreeButton_, goog.events.EventType.CLICK, this.onAgreeClick_);
};


});  // goog.scope
