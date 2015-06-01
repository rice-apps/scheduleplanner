/**
 * A pop-up slideshow view which provides the user with instructions on how to utilize the application.
 */

goog.provide('org.riceapps.views.TourView');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.style');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.fx.Animation');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var Animation = org.riceapps.fx.Animation;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



/**
 * @param {!org.riceapps.views.SchedulePlannerView} schedulePlannerView
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.TourView = function(schedulePlannerView) {
  goog.base(this);

  /** @private {!org.riceapps.views.SchedulePlannerView} */
  this.schedulePlannerView_ = schedulePlannerView;

  /** @private {!Element} */
  this.transparentOverlay_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.OVERLAY);

  /** @private {!Element} */
  this.exitButton_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.EXIT);

  /** @private {!Element} */
  this.nextButton_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.NEXT);

  /** @private {!Element} */
  this.prevButton_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.PREV);

  /** @private {!Array.<!Element>} */
  this.explanations_ = [];

  /** @private {number} */
  this.stage_ = 0;

  /** @private {number} */
  this.activeStage_ = -1;

  // DO NOT SUBMIT!
  window.tourView = this;
};
goog.inherits(org.riceapps.views.TourView,
              org.riceapps.views.View);
var TourView = org.riceapps.views.TourView;


/** @enum {string} */
TourView.Theme = {
  BASE: 'tour-view',
  OVERLAY: 'tour-view-overlay',
  FRAME: 'tour-view-frame',
  EXIT: 'tour-view-exit',
  NEXT: 'tour-view-next',
  PREV: 'tour-view-prev'
};


/**
 * @override
 */
TourView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), TourView.Theme.BASE);
  goog.dom.setTextContent(this.exitButton_, 'Exit Tour');
  goog.dom.appendChild(this.getElement(), this.exitButton_);
  goog.dom.setTextContent(this.nextButton_, '>');
  goog.dom.appendChild(this.getElement(), this.nextButton_);
  goog.dom.setTextContent(this.prevButton_, '<');
  goog.dom.appendChild(this.getElement(), this.prevButton_);

  var item;

  // TODO(mschurr): To implement tour view, we must build the frames in the tour here
  // and push them onto the explanations array.

  item = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.FRAME);
  goog.dom.setTextContent(item, 'Test1');
  goog.style.setElementShown(item, false);
  goog.dom.appendChild(this.getElement(), item);
  this.explanations_.push(item);

  item = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.FRAME);
  goog.dom.setTextContent(item, 'Test2');
  goog.style.setElementShown(item, false);
  goog.dom.appendChild(this.getElement(), item);
  this.explanations_.push(item);

  item = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.FRAME);
  goog.dom.setTextContent(item, 'Test3');
  goog.style.setElementShown(item, false);
  goog.dom.appendChild(this.getElement(), item);
  this.explanations_.push(item);
};


/**
 * @override
 */
TourView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.hide(true);

  this.getHandler().
      listen(this.exitButton_, goog.events.EventType.CLICK, this.handleExitButtonClick_).
      listen(this.nextButton_, goog.events.EventType.CLICK, this.handleNextButtonClick_).
      listen(this.prevButton_, goog.events.EventType.CLICK, this.handlePrevButtonClick_).
      listen(document, goog.events.EventType.KEYUP, this.handleKeyUp_);
};


/**
 * @param {!goog.events.KeyEvent} event
 * @private
 */
TourView.prototype.handleKeyUp_ = function(event) {
  switch (event.keyCode) {
    case goog.events.KeyCodes.ESC:
      this.hide();
      this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.EXIT_TOUR));
      break;

    case goog.events.KeyCodes.LEFT:
      if (this.stage_ > 0) {
        this.prev();
      }
      break;

    case goog.events.KeyCodes.RIGHT:
      if (this.stage_ < this.explanations_.length - 1) {
        this.next();
      }
      break;
  }
};

/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
TourView.prototype.handleExitButtonClick_ = function(opt_event) {
  this.hide();
  this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.EXIT_TOUR));
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
TourView.prototype.handleNextButtonClick_ = function(opt_event) {
  if (this.stage_ < this.explanations_.length - 1) {
    this.next();
  }
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
TourView.prototype.handlePrevButtonClick_ = function(opt_event) {
  if (this.stage_ > 0) {
    this.prev();
  }
};


/**
 * @override
 */
TourView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().removeAll();
};


/**
 * Updates the stage it which the tour is at.
 * @param {number} stage
 */
TourView.prototype.setStage = function(stage) {
  if (!this.isShown()) {
    return;
  }

  this.stage_ = stage;
  this.renderStage_();
};


/**
 * Increments the stage by one.
 */
TourView.prototype.next = function() {
  this.setStage(this.stage_ + 1);
};

/**
 * Decrements the stage by one.
 */
TourView.prototype.prev = function() {
  this.setStage(this.stage_ - 1);
};


/**
 * @override
 */
TourView.prototype.show = function(opt_preventAnimation) {
  goog.base(this, 'show', opt_preventAnimation);

  goog.style.setStyle(document.body, {
    'overflow': 'hidden'
  });
  goog.style.setElementShown(this.getElement(), true);
  goog.style.setElementShown(this.nextButton_, false);
  goog.style.setElementShown(this.prevButton_, false);
  goog.dom.appendChild(document.body, this.transparentOverlay_);

  if (!opt_preventAnimation) {
    Animation.start(this.exitButton_, Animation.Preset.FADE_IN);
    Animation.start(this.transparentOverlay_, Animation.Preset.FADE_IN);
  }

  this.stage_ = 0;
  this.activeStage_ = -1;
  this.renderStage_();
};


/**
 * @private
 */
TourView.prototype.renderStage_ = function() {
  var nextStage = this.stage_;
  var activeStage = this.activeStage_;
  var animation;
  this.activeStage_ = this.stage_;

  // If the stage has not changed, do nothing.
  if (nextStage == activeStage) {
    return;
  }

  // If the active stage is valid:
  if (activeStage >= 0 && activeStage < this.explanations_.length) {
    animation = Animation.Preset.ZOOM_OUT;
    if (nextStage >= 0 && nextStage < this.explanations_.length) {
      animation = (nextStage > activeStage ? Animation.Preset.FADE_OUT_LEFT : Animation.Preset.FADE_OUT_RIGHT);
    }

    // Animate out the active stage.
    Animation.start(this.explanations_[activeStage], animation).then(Animation.hideElement);
  }

  // If the next stage is valid:
  if (nextStage >= 0 && nextStage < this.explanations_.length) {
    animation = Animation.Preset.ZOOM_IN;
    if (activeStage >= 0 && activeStage < this.explanations_.length) {
      animation = (nextStage > activeStage ? Animation.Preset.FADE_IN_RIGHT : Animation.Preset.FADE_IN_LEFT);
    }

    // Animate in the next stage.
    goog.style.setElementShown(this.explanations_[nextStage], true);
    Animation.start(this.explanations_[nextStage], animation);
  } else {
    Animation.start(this.exitButton_, Animation.Preset.FADE_OUT);
    Animation.start(this.transparentOverlay_, Animation.Preset.FADE_OUT).then(goog.bind(function() {
      this.hide(true);
    }, this));
  }

  // Determine button state.
  if (nextStage > 0 && nextStage < this.explanations_.length) {
    goog.style.setElementShown(this.prevButton_, true);
    Animation.start(this.prevButton_, Animation.Preset.FADE_IN);
  } else {
    Animation.start(this.prevButton_, Animation.Preset.FADE_OUT).then(Animation.hideElement);
  }

  if (nextStage >= 0 && nextStage < this.explanations_.length - 1) {
    goog.style.setElementShown(this.nextButton_, true);
    Animation.start(this.nextButton_, Animation.Preset.FADE_IN);
  } else {
    Animation.start(this.nextButton_, Animation.Preset.FADE_OUT).then(Animation.hideElement);
  }
};


/**
 * @override
 */
TourView.prototype.hide = function(opt_preventAnimation) {
  goog.base(this, 'hide', opt_preventAnimation);

  goog.style.setStyle(document.body, {
    'overflow': 'inherit'
  });

  if (opt_preventAnimation) {
    goog.style.setElementShown(this.getElement(), false);
    goog.dom.removeNode(this.transparentOverlay_);
  } else {
    this.stage_ = -1;
    this.renderStage_();
  }
};


/**
 * @override
 */
TourView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);
};

});  // goog.scope
