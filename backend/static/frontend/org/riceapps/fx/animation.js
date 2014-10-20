goog.provide('org.riceapps.fx.Animation');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.object');
goog.require('goog.style');

goog.scope(function() {



/**
 * @param {!Element} element
 * @constructor
 */
org.riceapps.fx.Animation = function(element) {
  /** @private {boolean} */
  this.running_ = false;

  /** @private {boolean} */
  this.enqueued_ = false;

  /** @private {boolean} */
  this.paused_ = false;

  /** @private {!Element} */
  this.element_ = element;

  /** @private {boolean} */
  this.setupPerformed_ = false;

  /** @private {boolean} */
  this.cleanupPerformed_ = false;

  /** @private {number} */
  this.transitionStage_ = 0;

  /** @private {?Animation.Animation} */
  this.animation_ = null;

  /** @private {!Array.<Animation.Transform>} */
  this.transforms_ = [];

  /** @private {number} */
  this.nextStageTimer_ = -1;
};
var Animation = org.riceapps.fx.Animation;


/**
 * An enumeration of pre-defined animation timing functions.
 * This enumeration can be extended using CSS3's cubic-bezier().
 * @enum {string}
 */
Animation.Timing = {
  EASE: 'ease',
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out'
};


/**
 * @const {Animation.Timing}
 */
Animation.DEFAULT_TIMING = Animation.Timing.EASE;


/**
 * @typedef {{
 *   x: (number|undefined),
 *   y: (number|undefined),
 *   z: (number|undefined),
 *   opacity: (number|undefined),
 *   rotateX: (number|undefined),
 *   rotateY: (number|undefined),
 *   rotateZ: (number|undefined),
 *   skewX: (number|undefined),
 *   skewY: (number|undefined),
 *   scaleX: (number|undefined),
 *   scaleY: (number|undefined),
 *   scaleZ: (number|undefined),
 *   duration: (number|undefined),
 *   delay: (number|undefined),
 *   timing: (Animation.Timing|undefined),
 *   width: (number|undefined),
 *   height: (number|undefined)
 * }}
 *
 * Note: The following properties may be useful to add later:
 *  text-shadow
 *  perspective
 *  perspective-origin
 *  padding
 *  outline
 *  margin
 *  color
 *  box-shadow
 *  border
 *  background
 */
Animation.Transform;


/**
 * An enumeration of pre-defined animations.
 * @enum {!Array.<!Animation.Tranform>}
 */
Animation.PresetTransform = {};


/**
 * An enumeration of pre-defined animations.
 * @enum {string}
 */
Animation.Preset = {
  BOUNCE: 'bounce',
  FLASH: 'flash',
  PULSE: 'pulse',
  RUBBER_BAND: 'rubberBand',
  SHAKE: 'shake',
  SWING: 'swing',
  TADA: 'tada',
  WOBBLE: 'wobble',
  BOUNCE_IN: 'bounceIn',
  BOUNCE_IN_DOWN: 'bounceInDown',
  BOUNCE_IN_LEFT: 'bounceInLeft',
  BOUNCE_IN_RIGHT: 'bounceInRight',
  BOUNCE_IN_UP: 'bounceInUp',
  BOUNCE_OUT: 'bounceOut',
  BOUNCE_OUT_DOWN: 'bounceOutDown',
  BOUNCE_OUT_LEFT: 'bounceOutLeft',
  BOUNCE_OUT_RIGHT: 'bounceOutRight',
  BOUNCE_OUT_UP: 'bounceOutUp',
  FADE_IN: 'fadeIn',
  FADE_IN_DOWN: 'fadeInDown',
  FADE_IN_DOWN_BIG: 'fadeInDownBig',
  FADE_IN_LEFT: 'fadeInLeft',
  FADE_IN_LEFT_BIG: 'fadeInLeftBig',
  FADE_IN_RIGHT: 'fadeInRight',
  FADE_IN_RIGHT_BIG: 'fadeInRightBig',
  FADE_IN_UP: 'fadeInUp',
  FADE_IN_UP_BIG: 'fadeInUpBig',
  FADE_OUT: 'fadeOut',
  FADE_OUT_DOWN: 'fadeOutDown',
  FADE_OUT_DOWN_BIG: 'fadeOutDownBig',
  FADE_OUT_LEFT: 'fadeOutLeft',
  FADE_OUT_LEFT_BIG: 'fadeOutLeftBig',
  FADE_OUT_RIGHT: 'fadeOutRight',
  FADE_OUT_RIGHT_BIG: 'fadeOutRightBig',
  FADE_OUT_UP: 'fadeOutUp',
  FADE_OUT_UP_BIG: 'fadeOutUpBig',
  LIGHT_SPEED_IN: 'lightSpeedIn',
  LIGHT_SPEED_OUT: 'lightSpeedOut',
  FLIP: 'flip',
  FLIP_IN_X: 'flipInX',
  FLIP_IN_Y: 'flipInY',
  FLIP_OUT_X: 'flipOutX',
  FLIP_OUT_Y: 'flipOutY',
  ROTATE_IN: 'rotateIn',
  ROTATE_IN_DOWN_LEFT: 'rotateInDownLeft',
  ROTATE_IN_DOWN_RIGHT: 'rotateInDownRight',
  ROTATE_IN_UP_LEFT: 'rotateInUpLeft',
  ROTATE_IN_UP_RIGHT: 'rotateInUpRight',
  ROTATE_OUT: 'rotateOut',
  ROTATE_OUT_DOWN_LEFT: 'rotateOutDownLeft',
  ROTATE_OUT_DOWN_RIGHT: 'rotateOutDownRight',
  ROTATE_OUT_UP_LEFT: 'rotateOutUpLeft',
  ROTATE_OUT_UP_RIGHT: 'rotateOutUpRight',
  HINGE: 'hinge',
  ROLL_IN: 'rollIn',
  ROLL_OUT: 'rollOut',
  ZOOM_IN: 'zoomIn',
  ZOOM_IN_DOWN: 'zoomInDown',
  ZOOM_IN_LEFT: 'zoomInLeft',
  ZOOM_IN_RIGHT: 'zoomInRight',
  ZOOM_IN_UP: 'zoomInUp',
  ZOOM_OUT: 'zoomOut',
  ZOOM_OUT_DOWN: 'zoomOutDown',
  ZOOM_OUT_LEFT: 'zoomOutLeft',
  ZOOM_OUT_RIGHT: 'zoomOutRight',
  ZOOM_OUT_UP: 'zoomOutUp'
};


/**
 * @enum {string}
 */
Animation.Repeat = {
  FOREVER: 'infinite',
  ONCE: '1'
};


/**
 * @enum {string}
 */
Animation.FillMode = {
  FORWARDS: 'forwards',
  BACKWARDS: 'backwards',
  BOTH: 'both',
  NONE: 'none'
};


/**
 * @enum {string}
 */
Animation.Direction = {
  NORMAL: 'normal',
  REVERSE: 'reverse',
  ALTERNATE: 'alternate',
  ALTERNATE_REVERSE: 'alternate-reverse'
};


/**
 * @typedef {{
 *   name: (string|Animation.Preset),
 *   timing: (Animation.Timing|undefined),
 *   delay: (number|undefined),
 *   iterations: (number|Animation.Repeat|undefined),
 *   fill: (Animation.FillMode|undefined),
 *   duration: (number|undefined)
 * }}
 */
Animation.Animation;


/**
 * @const {string}
 */
Animation.BASE_CLASS = 'animated';


/**
 * @const {number}
 */
Animation.DEFAULT_DURATION = 1000;


/**
 * @const {Animation.Animation}
 */
Animation.ANIMATION_DEFAULTS = {
  name: Animation.Preset.FLASH,
  timing: Animation.DEFAULT_TIMING,
  delay: 0,
  iterations: 1,
  fill: Animation.FillMode.NORMAL,
  duration: Animation.DEFAULT_DURATION
};


/**
 * @const {!Array.<string>}
 */
Animation.END_EVENTS = [
  'webkitAnimationEnd',
  'mozAnimationEnd',
  'MSAnimationEnd',
  'oanimationend',
  'animationend'
];


/**
 * @enum {number}
 */
Animation.Mode = {
  QUEUE: 1,
  INTERRUPT: 2,
  AVAILABLE: 3
};


/**
 * @const {Animation.Mode}
 */
Animation.DEFAULT_MODE = Animation.Mode.INTERRUPT;


/**
 * @param {!Element} element
 * @return {!Animation}
 */
Animation.on = function(element) {
  return new Animation(element);
};

Animation.getTransformState = function(element) {};
Animation.prototype.onInterrupt = function() {};
Animation.prototype.onStart = function() {};
Animation.prototype.onSetup = function() {};
Animation.prototype.onCleanup = function() {};
Animation.prototype.onComplete = function() {};
Animation.prototype.addTransition = function() {};
Animation.prototype.getTransformState = function() {};
Animation.prototype.isRunning = function() {};
Animation.prototype.isEnqueued = function() {};
Animation.prototype.isPaused = function() {};
Animation.prototype.then = function() {};
Animation.prototype.start = function(mode) {};
Animation.prototype.cancel = function() {};


Animation.prototype.pause = function() {
  if (this.paused_ || !this.running_) {
    return;
  }

  goog.style.setStyle(this.element_, {
    'animation-play-state': 'paused'
  });

  // Clear and store timers.
};


Animation.prototype.resume = function() {
  if (!this.paused || !this.running_) {
    return;
  }

  goog.style.setStyle(this.element_, {
    'animation-play-state': 'running'
  });

  // Restore timers.
};

});
