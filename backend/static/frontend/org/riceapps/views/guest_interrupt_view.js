/**
 * A view that displays information about browing the application as a guest.
 */

goog.provide('org.riceapps.views.GuestInterruptView');

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
org.riceapps.views.GuestInterruptView = function() {
  goog.base(this);

  /** @private {Element} */
  this.agreeButton_ = null;
};
goog.inherits(org.riceapps.views.GuestInterruptView,
              org.riceapps.views.InterruptView);
var GuestInterruptView = org.riceapps.views.GuestInterruptView;


/** @enum {string} */
GuestInterruptView.Theme = {
  BASE: 'guest-interrupt-view',
  CONTENT: 'guest-interrupt-view-content'
};


/**
 * @override
 */
GuestInterruptView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), GuestInterruptView.Theme.BASE);

  var container = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.setTextContent(container, 'Welcome to Schedule Planner!');
  goog.dom.appendChild(this.getElement(), container);

  var contentContainer = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(contentContainer, GuestInterruptView.Theme.CONTENT);
  goog.dom.appendChild(container, contentContainer);

  var element;

  element = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(element, 'You are browsing Schedule Planner as a guest. In guest mode, certain features are unavailable ' +
      'and your schedule and preferences will not be saved.');
  goog.dom.appendChild(contentContainer, element);

  element = goog.dom.createDom(goog.dom.TagName.DIV);
  element.innerHTML = '&nbsp;';
  goog.dom.appendChild(contentContainer, element);

  element = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(element, 'In order to get access to the full set of features, you can log in using your Rice Net ID.');
  goog.dom.appendChild(contentContainer, element);

  element = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(element, 'clear');
  goog.dom.appendChild(container, element);

  this.agreeButton_ = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'type': 'submit',
    'value': 'Continue as Guest'
  });
  goog.dom.appendChild(container, this.agreeButton_);
  goog.style.setStyle(this.agreeButton_, {'float': 'right'});

  element = goog.dom.createDom(goog.dom.TagName.A);
  goog.dom.setTextContent(element, 'Login Now');
  goog.dom.classlist.add(element, 'input');
  element.href = '/login';
  goog.style.setStyle(element, {'float': 'right', 'margin-right': '5px'});
  goog.dom.appendChild(container, element);

  element = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(element, 'clear');
  goog.dom.appendChild(container, element);
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
GuestInterruptView.prototype.onAgreeClick_ = function(event) {
  this.hide();
  this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.AGREE_GUEST));
};


/**
 * @override
 */
GuestInterruptView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(this.agreeButton_, goog.events.EventType.CLICK, this.onAgreeClick_);
};


/**
 * @override
 */
GuestInterruptView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().removeAll();
};


});  // goog.scope
