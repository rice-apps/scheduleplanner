/**
 * A view that displays what has changed in the application since the last time the user was present.
 */

goog.provide('org.riceapps.views.VersionInterruptView');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('org.riceapps.SchedulePlannerVersion');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.views.InterruptView');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;
var SchedulePlannerVersion = org.riceapps.SchedulePlannerVersion;



/**
 * @extends {org.riceapps.views.InterruptView}
 * @constructor
 */
org.riceapps.views.VersionInterruptView = function() {
  goog.base(this);

  /** @private {Element} */
  this.agreeButton_ = null;

  /** @private {number} */
  this.version_ = 0;
};
goog.inherits(org.riceapps.views.VersionInterruptView,
              org.riceapps.views.InterruptView);
var VersionInterruptView = org.riceapps.views.VersionInterruptView;


/** @enum {string} */
VersionInterruptView.Theme = {
  BASE: 'version-interrupt-view',
  CHANGES: 'version-interrupt-view-changes',
  VHEADER: 'version',
  VITEMS: 'vitems'
};


/**
 * @param {number} version
 */
VersionInterruptView.prototype.setVersion = function(version) {
  this.version_ = version;

  if (this.isInDocument()) {
    this.relayout();
  }
};


/**
 * @override
 */
VersionInterruptView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), VersionInterruptView.Theme.BASE);

  var container = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.setTextContent(container, 'What\'s New in Schedule Planner');
  goog.dom.appendChild(this.getElement(), container);

  var changesContainer = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(changesContainer, VersionInterruptView.Theme.CHANGES);
  goog.dom.appendChild(container, changesContainer);

  var element;

  this.agreeButton_ = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'type': 'submit',
    'value': 'Got It!'
  });
  goog.dom.appendChild(container, this.agreeButton_);

  element = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(element, 'clear');
  goog.dom.appendChild(container, element);
  this.relayout();
};


/**
 * @override
 */
VersionInterruptView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);

  var changesContainer = this.getElement().querySelector('.' + VersionInterruptView.Theme.CHANGES);
  goog.dom.removeChildren(changesContainer);
  var element, ul;

  for (var i = this.version_ + 1; i <= SchedulePlannerVersion.CURRENT_VERSION; i++) {
    element = goog.dom.createDom(goog.dom.TagName.SPAN);
    goog.dom.classlist.add(element, VersionInterruptView.Theme.VHEADER);
    goog.dom.setTextContent(element, 'Version ' + i);
    goog.dom.appendChild(changesContainer, element);

    ul = goog.dom.createDom(goog.dom.TagName.UL);
    goog.dom.classlist.add(ul, VersionInterruptView.Theme.VITEMS);
    goog.dom.appendChild(changesContainer, ul);

    for (var j = 0; j < SchedulePlannerVersion.MESSAGES[i].length; j++) {
      element = goog.dom.createDom(goog.dom.TagName.LI);
      goog.dom.setTextContent(element, SchedulePlannerVersion.MESSAGES[i][j]);
      goog.dom.appendChild(ul, element);
    }
  }
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
VersionInterruptView.prototype.onAgreeClick_ = function(event) {
  this.hide();
  this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.AGREE_VERSION));
};


/**
 * @override
 */
VersionInterruptView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(this.agreeButton_, goog.events.EventType.CLICK, this.onAgreeClick_);
};


/**
 * @override
 */
VersionInterruptView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().removeAll();
};


});  // goog.scope
