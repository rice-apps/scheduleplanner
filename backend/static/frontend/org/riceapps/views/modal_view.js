/**
 * A modal view is a pop-up that prevents the user from interacting with anything outside of the pop-up until the pop-up is dismissed by
 * pressing escape, clicking outside of the pop-up, or clicking the close button.
 *
 * This class encapsulates basic functionality for a modal view by creating an empty pop-up window, close button, and animations.
 *
 * You should not instantiate this class directly, but rather create a subclass and build your content in createDom.
 */

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
goog.require('org.riceapps.utils.WindowManager');

goog.scope(function() {
var Animation = org.riceapps.fx.Animation;
var WindowManager = org.riceapps.utils.WindowManager;



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

  var disposeOnHide = this.disposeOnHide_;
  this.disposeOnHide_ = false;
  this.hide(true);
  this.disposeOnHide_ = disposeOnHide;
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
    this.render(document.body);
  }

  if (this.isShown()) {
    return;
  }

  var index = WindowManager.getSharedInstance().push(this);
  window.console.log('ModalView.show', index);
  goog.style.setStyle(this.getElement(), { 'z-index': index });
  goog.style.setStyle(this.transparentOverlay_, { 'z-index': (index - 1) });

  goog.base(this, 'show', opt_preventAnimation);

  goog.style.setElementShown(this.getElement(), true);
  goog.style.setElementShown(this.transparentOverlay_, true);

  if (!opt_preventAnimation) {
    Animation.perform(this.getElementStrict(), {
      name: Animation.Preset.ZOOM_IN,
      duration: 400
    });

    Animation.perform(this.transparentOverlay_, Animation.Preset.FADE_IN);
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

  if (opt_preventAnimation) {
    goog.style.setElementShown(this.getElement(), false);
    goog.style.setElementShown(this.transparentOverlay_, false);

    this.dispatchEvent(new goog.events.Event(ModalView.EventType.DISMISSED));
    if (this.disposeOnHide_) {
      this.dispose();
    }
  } else {
    Animation.
        perform(this.transparentOverlay_, Animation.Preset.FADE_OUT).
        then(Animation.hideElement);

    Animation.
        perform(this.getElementStrict(), {
          name: Animation.Preset.ZOOM_OUT,
          duration: 400
        }).
        then(Animation.hideElement).
        then(goog.bind(function(element) {
          this.dispatchEvent(new goog.events.Event(ModalView.EventType.DISMISSED));
          if (this.disposeOnHide_) {
            this.dispose();
          }
        }, this));
  }

  WindowManager.getSharedInstance().pop(this);
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ModalView.prototype.handleOverlayClicked_ = function(event) {
  this.hide();
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ModalView.prototype.handleCloseClicked_ = function(event) {
  this.hide();
};


/**
 * @param {!goog.events.KeyEvent} event
 * @private
 */
ModalView.prototype.handleKeyUp_ = function(event) {
  if (event.keyCode == goog.events.KeyCodes.ESC &&
      WindowManager.getSharedInstance().isActiveWindow(this)) {
    this.hide();
  }
};

});  // goog.scope
