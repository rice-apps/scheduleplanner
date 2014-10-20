goog.provide('org.riceapps.views.ModalView');

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
org.riceapps.views.ModalView = function() {
  goog.base(this);

  /** @private {!Element} */
  this.transparentOverlay_ = goog.dom.createDom(goog.dom.TagName.DIV, ModalView.Theme.OVERLAY);

  /** @private {Element} */
  this.closeButton_ = goog.dom.createDom(goog.dom.TagName.DIV, ModalView.Theme.CLOSE_BUTTON);

  /** @private {boolean} */
  this.disposeOnHide_ = false;
};
goog.inherits(org.riceapps.views.ModalView,
              org.riceapps.views.View);
var ModalView = org.riceapps.views.ModalView;


/**
 * @enum {string}
 */
ModalView.Theme = {
  OVERLAY: 'modal-view-overlay',
  CLOSE_BUTTON: 'modal-view-close-button',
  BASE: 'modal-view'
};


/**
 * @enum {string}
 */
ModalView.EventType = {
  DISMISSED: 'modal_view_dismissed'
};


/**
 * @override
 */
ModalView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), ModalView.Theme.BASE);
  goog.dom.appendChild(this.getElement(), this.closeButton_);
};


/**
 * @return {!ModalView}
 */
ModalView.prototype.disposeOnHide = function() {
  this.disposeOnHide_ = true;
  return this;
};


/**
 * @override
 */
ModalView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  goog.dom.appendChild(document.body, this.transparentOverlay_);
  this.getHandler().
      listen(document, goog.events.EventType.KEYUP, this.handleKeyUp_).
      listen(this.transparentOverlay_, goog.events.EventType.CLICK, this.handleOverlayClicked_).
      listen(this.closeButton_, goog.events.EventType.CLICK, this.handleCloseClicked_);

  this.hide(true);
};


/**
 * @override
 */
ModalView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  goog.dom.removeNode(this.transparentOverlay_);
  this.getHandler().removeAll();
};


/**
 * @override
 */
ModalView.prototype.relayout = function(opt_preventAnimation) {
  // NOTE: We don't need to do anything here; positining is all recalculated using CSS.
  goog.base(this, 'relayout', opt_preventAnimation);
};


/**
 * @override
 */
ModalView.prototype.show = function(opt_preventAnimation) {
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
ModalView.prototype.hide = function(opt_preventAnimation) {
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
      this.dispatchEvent(new goog.events.Event(ModalView.EventType.DISMISSED));
      if (this.disposeOnHide_) {
        this.dispose();
      }
    }, Animation.DEFAULT_DURATION, this);
  }
};


/**
 * @param {!goog.events.BrowserEvent} event
 */
ModalView.prototype.handleOverlayClicked_ = function(event) {
  this.hide();
};


/**
 * @param {!goog.events.BrowserEvent} event
 */
ModalView.prototype.handleCloseClicked_ = function(event) {
  this.hide();
};


/**
 * @param {!goog.events.KeyEvent} event
 */
ModalView.prototype.handleKeyUp_ = function(event) {
  if (event.keyCode == goog.events.KeyCodes.ESC) {
    this.hide();
  }
};

});  // goog.scope
