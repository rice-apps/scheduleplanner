goog.provide('org.riceapps.views.InterruptView');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('org.riceapps.fx.Animation');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var Animation = org.riceapps.fx.Animation;



/**
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.InterruptView = function() {
  goog.base(this);

  /** @private {!Element} */
  this.transparentOverlay_ = goog.dom.createDom(goog.dom.TagName.DIV, InterruptView.Theme.OVERLAY);

  /** @private {boolean} */
  this.disposeOnHide_ = false;
};
goog.inherits(org.riceapps.views.InterruptView,
              org.riceapps.views.View);
var InterruptView = org.riceapps.views.InterruptView;


/**
 * @enum {string}
 */
InterruptView.Theme = {
  OVERLAY: 'interrupt-view-overlay',
  BASE: 'interrupt-view'
};


/**
 * @override
 */
InterruptView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), InterruptView.Theme.BASE);
};


/**
 * @return {!InterruptView}
 */
InterruptView.prototype.disposeOnHide = function() {
  this.disposeOnHide_ = true;
  return this;
};


/**
 * @override
 */
InterruptView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  goog.dom.appendChild(document.body, this.transparentOverlay_);
  this.hide(true);
};


/**
 * @override
 */
InterruptView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  goog.dom.removeNode(this.transparentOverlay_);
};


/**
 * @override
 */
InterruptView.prototype.show = function(opt_preventAnimation) {
  if (!this.isInDocument()) {
    this.render();
  }

  if (this.isShown()) {
    return;
  }

  goog.base(this, 'show', opt_preventAnimation);

  goog.style.setElementShown(this.getElement(), true);
  goog.style.setElementShown(this.transparentOverlay_, true);


  goog.dom.classlist.removeAll(this.getElement(),
      [Animation.BASE_CLASS, Animation.Preset.ZOOM_IN, Animation.Preset.ZOOM_OUT]);
  goog.dom.classlist.removeAll(this.transparentOverlay_,
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN, Animation.Preset.FADE_OUT]);

  if (!opt_preventAnimation) {
    goog.style.setElementShown(this.getElement(), true);
    goog.style.setElementShown(this.transparentOverlay_, true);
    goog.dom.classlist.addAll(this.getElement(), [Animation.BASE_CLASS, Animation.Preset.ZOOM_IN]);
    goog.dom.classlist.addAll(this.transparentOverlay_, [Animation.BASE_CLASS, Animation.Preset.FADE_IN]);
  }
};


/**
 * @override
 */
InterruptView.prototype.hide = function(opt_preventAnimation) {
  if (!this.isInDocument() || this.isHidden()) {
    return;
  }

  goog.base(this, 'hide', opt_preventAnimation);

  goog.dom.classlist.removeAll(this.getElement(),
      [Animation.BASE_CLASS, Animation.Preset.ZOOM_IN, Animation.Preset.ZOOM_OUT]);
  goog.dom.classlist.removeAll(this.transparentOverlay_,
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN, Animation.Preset.FADE_OUT]);

  if (opt_preventAnimation) {
    goog.style.setElementShown(this.getElement(), false);
    goog.style.setElementShown(this.transparentOverlay_, false);
  } else {
    goog.dom.classlist.addAll(this.getElement(), [Animation.BASE_CLASS, Animation.Preset.ZOOM_OUT]);
    goog.dom.classlist.addAll(this.transparentOverlay_, [Animation.BASE_CLASS, Animation.Preset.FADE_OUT]);
    goog.Timer.callOnce(function() {
      goog.style.setElementShown(this.getElement(), false);
      goog.style.setElementShown(this.transparentOverlay_, false);
      if (this.disposeOnHide_) {
        this.dispose();
      }
    }, Animation.DEFAULT_DURATION, this);
  }
};

});  // goog.scope
