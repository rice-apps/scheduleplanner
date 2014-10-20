goog.provide('org.riceapps.views.TourView');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('org.riceapps.fx.Animation');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var Animation = org.riceapps.fx.Animation;



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

  /** @private {!Array.<!Element>} */
  this.explanations_ = [];

  /** @private {number} */
  this.stage_ = 0;

  /** @private {number} */
  this.transitionTimer_ = -1;
};
goog.inherits(org.riceapps.views.TourView,
              org.riceapps.views.View);
var TourView = org.riceapps.views.TourView;


/** @enum {string} */
TourView.Theme = {
  BASE: 'tour-view',
  OVERLAY: 'tour-view-overlay',
  FRAME: 'tour-view-frame'
};


/**
 * @override
 */
TourView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), TourView.Theme.BASE);


  var item = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.FRAME);
  goog.dom.setTextContent(item, 'Test1');
  goog.style.setElementShown(item, false);
  goog.dom.appendChild(this.getElement(), item);
  this.explanations_.push(item);

  var item = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.FRAME);
  goog.dom.setTextContent(item, 'Test2');
  goog.style.setElementShown(item, false);
  goog.dom.appendChild(this.getElement(), item);
  this.explanations_.push(item);

  var item = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.FRAME);
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
  //this.show();
};


/**
 * @override
 */
TourView.prototype.show = function(opt_preventAnimation) {
  goog.base(this, 'show', opt_preventAnimation);


  goog.style.setElementShown(this.getElement(), true);
  goog.dom.appendChild(document.body, this.transparentOverlay_);

  if (!opt_preventAnimation) {
    goog.dom.classlist.removeAll(this.transparentOverlay_,
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN, Animation.Preset.FADE_OUT]);
    goog.dom.classlist.addAll(this.transparentOverlay_,
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN]);
  }

  this.stage_ = 0;
  this.renderStage_();
};


/**
 * @override
 */
TourView.prototype.advanceStage = function() {
  this.stage_ = Math.max(0, Math.min(this.stage_ + 1 , this.explanations_.length));
  this.renderStage_();
};


/**
 * @param {boolean=} opt_preventAnimation
 * @private
 */
TourView.prototype.renderStage_ = function(opt_preventAnimation) {
  if (this.stage_ > 0) {
    goog.dom.classlist.removeAll(this.explanations_[this.stage_ - 1],
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN_RIGHT, Animation.Preset.FADE_OUT_LEFT]);
    goog.dom.classlist.addAll(this.explanations_[this.stage_ - 1],
      [Animation.BASE_CLASS, Animation.Preset.FADE_OUT_LEFT]);
    var stage = this.stage_ - 1;
    goog.Timer.callOnce(function() {
      goog.style.setElementShown(this.explanations_[stage], false);
    }, 300, this);
  }

  if (this.stage_ == this.explanations_.length) {
    this.hide();
    return;
  } else {
    goog.style.setElementShown(this.explanations_[this.stage_], true);
    goog.dom.classlist.removeAll(this.explanations_[this.stage_],
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN_RIGHT, Animation.Preset.FADE_OUT_LEFT]);
    goog.dom.classlist.addAll(this.explanations_[this.stage_],
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN_RIGHT]);
  }
};


/**
 * @enum {number}
 */
TourView.Alignment = {
  TOP: 1,
  BOTTOM: 2,
  LEFT: 3,
  RIGHT: 4
};


/**
 * @override
 */
TourView.prototype.hide = function(opt_preventAnimation) {
  goog.base(this, 'hide', opt_preventAnimation);

  if (opt_preventAnimation) {
    goog.style.setElementShown(this.getElement(), false);
    goog.dom.removeNode(this.transparentOverlay_);
  } else {
    goog.dom.classlist.removeAll(this.transparentOverlay_,
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN, Animation.Preset.FADE_OUT]);
    goog.dom.classlist.addAll(this.transparentOverlay_,
      [Animation.BASE_CLASS, Animation.Preset.FADE_OUT]);

    if (this.transitionTimer_ != -1) {
      goog.Timer.clear(this.transitionTimer_);
    }

    this.transitionTimer_ = goog.Timer.callOnce(function() {
      goog.style.setElementShown(this.getElement(), false);
      goog.dom.removeNode(this.transparentOverlay_);
    }, 300, this);
  }
};


/**
 * @override
 */
TourView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);
};

});  // goog.scope
