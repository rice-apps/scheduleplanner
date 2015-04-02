/**
 * A library that aims to greatly simplify animation in Javascript.
 *
 * Example Usage:
 * var element = goog.dom.createDom(goog.dom.TagName.DIV);
 * goog.dom.appendChild(document.body, element);
 * goog.style.setElementShown(element, false);
 * goog.style.setStyle(element, {
 *   'position': 'absolute',
 *   'top': 'calc(50% - 50px)',
 *   'left': 'calc(50% - 50px)',
 *   'width': '100px',
 *   'height': '100px',
 *   'background-color': 'red'
 * });
 *
 * Animation.
 *  showElement(element).
 *  then(Animation.create(Animation.Preset.FADE_IN)).
 *  then(Animation.create(Animation.Preset.BOUNCE)).
 *  then(Animation.create(Animation.Preset.FADE_OUT)).
 *  then(Animation.hideElement).
 *  then(function(element) { window.console.log('Finished animating: ', element); });
 *
 */


goog.provide('org.riceapps.fx.Animator');
goog.provide('org.riceapps.fx.Animation');
goog.provide('org.riceapps.fx.Animation.Direction');
goog.provide('org.riceapps.fx.Animation.Fill');
goog.provide('org.riceapps.fx.Animation.Preset');
goog.provide('org.riceapps.fx.Animation.Repeat');
goog.provide('org.riceapps.fx.Animation.State');
goog.provide('org.riceapps.fx.Animation.Timing');

goog.require('goog.Promise');
goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.IdGenerator');

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
 * @param {!Element} element
 * @constructor
 */
org.riceapps.fx.Animator = function(element) {};
var Animator = org.riceapps.fx.Animator;


/**
 * An enumeration of pre-defined animation timing functions.
 * This enumeration can be extended using CSS3's cubic-bezier(n,n,n,n).
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
 *   translateX: (number|undefined),
 *   translateY: (number|undefined),
 *   translateZ: (number|undefined),
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
 *  perspective: length;
 *  perspective-origin: x y;
 *  backgace-visibility: visible|hidden;
 *  padding
 *  outline
 *  margin
 *  color
 *  box-shadow
 *  border
 *  background
 *  transform-origin: x y z;
 *  transform-style: flat|preserve-3d
 *  matrix(n,n,n,n,n,n)
 *  matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n)
 *  translate(x,y)
 *  scale(x,y)
 *  scale3d(x,y,z)
 *  rotate3d(x,y,z,angle)
 *  skew(x-ang, y-ang)
 *  translate3d(x,y,z)
 *  perspective(n)
 *  will-change
 */
Animation.Transform;


/**
 * An enumeration of pre-defined animations.
 * @enum {!Array.<!Animation.Transform>}
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
Animation.Fill = {
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
 * @enum {string}
 */
Animation.State = {
  RUNNING: 'running',
  PAUSED: 'paused'
};


/**
 * @enum {number}
 */
Animation.Mode = {
  /** Animation will be queued after anything else queued on the element. */
  //QUEUE: 1,

  /** Animation will cancel (interrupt) any existing (queued or in-progress) animations and occur immediately. */
  INTERRUPT: 2,

  /** Animation will only occur if no other animation is in progress. */
  AVAILABLE: 3
};


/**
 * @const {Animation.Mode}
 */
Animation.DEFAULT_MODE = Animation.Mode.INTERRUPT;


/**
 * NOTE: All times are in milliseconds.
 * @typedef {{
 *   name: (string|Animation.Preset),
 *   timing: (Animation.Timing|undefined),
 *   delay: (number|undefined),
 *   repeat: (number|Animation.Repeat|undefined),
 *   fill: (Animation.Fill|undefined),
 *   duration: (number|undefined),
 *   state: (Animation.State|undefined),
 *   direction: (Animation.Direction|undefined),
 *   addClass: (string|!Array.<string>|undefined),
 *   mode: (Animation.Mode|undefined)
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
Animation.DEFAULT_DURATION = 500;


/**
 * @const {Animation.Animation}
 */
Animation.ANIMATION_DEFAULTS = {
  name: Animation.Preset.FLASH,
  timing: Animation.DEFAULT_TIMING,
  delay: 0,
  repeat: Animation.Repeat.ONCE,
  fill: Animation.Fill.BOTH,
  duration: Animation.DEFAULT_DURATION,
  state: Animation.State.RUNNING,
  direction: Animation.Direction.NORMAL,
  addClass: undefined,
  mode: Animation.DEFAULT_MODE
};


/**
 * NOTE: Events have animationName, elapsedTime properties.
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
 * @const {!Array.<string>}
 */
Animation.START_EVENTS = [
  'webkitAnimationStart',
  'mozAnimationStart',
  'MSAnimationStart',
  'oanimationstart',
  'animationstart'
];


/**
 * @const {!Array.<string>}
 */
Animation.ITERATION_EVENTS = [
  'webkitAnimationIteration',
  'mozAnimationIteration',
  'MSAnimationIteration',
  'oanimationiteration',
  'animationiteration'
];


/**
 * @const {!Array.<string>}
 */
Animation.PROPERTY_PREFIXES = [
  '',
  '-moz-',
  '-webkit-',
  '-o-'
];


/**
 * @enum {string}
 */
Animation.CSS = {
  NAME: 'animation-name', /* refers to keyframe */
  DURATION: 'animation-duration', /* e.g. 200ms */
  TIMING: 'animation-timing-function', /* see Animation.Timing */
  DELAY: 'animation-delay', /* e.g. 200ms */
  REPEAT: 'animation-iteration-count', /* number|infinite */
  DIRECTION: 'animation-direction', /* see Animation.Direction */
  FILL: 'animation-fill-mode', /* see Animation.Fill */
  STATE: 'animation-play-state' /* see Animation.State */
};


/**
 * @enum {string}
 */
Animation.TransitionCSS = {
  DELAY: 'transition-delay', /* e.g. 200ms */
  DURATION: 'transition-duration', /* e.g. 200ms */
  PROPERTY: 'transition-property', /* e.g. none|all|property */
  TIMING: 'transition-timing-function' /* see Animation.Timing */
};


/**
 * NOTE: Events have propertyName and elapsedTime properties.
 * @const {!Array.<string>}
 */
Animation.TransitionEndEvents = [
  'oTransitionEnd',
  'otransitionend',
  'webkitTransitionEnd',
  'transitionend'
];


/**
 * @type {!goog.ui.IdGenerator}
 */
Animation.ID_GENERATOR = new goog.ui.IdGenerator();


/**
 * @const {string}
 */
Animation.ACTIVE_PROPERTY = '__active_animation_id';


/**
 * Hides a given element and returns a promise that immediately resolves to that element.
 * @param {!Element} element
 * @return {!goog.Promise.<!Element>}
 */
Animation.hideElement = function(element) {
  goog.style.setElementShown(element, false);
  return goog.Promise.resolve(element);
};


/**
 * Shows a given element and returns a promise that immediately resolves to that element.
 * @param {!Element} element
 * @return {!goog.Promise.<!Element>}
 */
Animation.showElement = function(element) {
  goog.style.setElementShown(element, true);
  return goog.Promise.resolve(element);
};


/**
 * Applies an animation to an element and returns a promise that resolves when the animation completes.
 * @param {!Element} element
 * @param {!Animation.Animation|string} animation
 * @return {!goog.Promise.<!Element>}
 */
Animation.perform = function(element, animation) {
  if (typeof animation == 'string') {
    animation = /** @type {!Animation.Animation} */ ({ name: animation });
  }

  if (animation.name == null || animation.name == undefined) {
    throw Error('You must specify an animation name.');
  }

  if (typeof element[Animation.ACTIVE_PROPERTY] == 'string' &&
      animation.mode == Animation.Mode.AVAILABLE) {
    return new goog.Promise(function(resolve,reject){});
  }

  var uid = Animation.ID_GENERATOR.getNextUniqueId();
  element[Animation.ACTIVE_PROPERTY] = uid;

  if (animation.addClass && typeof animation.addClass == 'string') {
    animation.addClass = [animation.addClass];
  } else if (!animation.addClass) {
    animation.addClass = [];
  }

  if (goog.object.containsValue(Animation.Preset, animation.name)) {
    animation.addClass.unshift(Animation.BASE_CLASS);
    animation.addClass.push(animation.name);
  }

  // Fill in any missing animation properties with the default values.
  for (var key in Animation.ANIMATION_DEFAULTS) {
    if (animation[key] === undefined) {
      animation[key] = Animation.ANIMATION_DEFAULTS[key];
    }
  }

  window.console.log('Animation.perform(): ', uid, animation);

  // Remove any existing animation end listeners.
  for (var i = 0; i < Animation.END_EVENTS.length; i++) {
    //goog.events.dispatchEvent();
    //goog.events.removeAll(element, Animation.END_EVENTS[i]);
  }

  // Remove any existing animations.
  goog.dom.classlist.removeAll(element, Object.keys(Animation.Preset).map(function(key) {
      return Animation.Preset[key];
  }));

  /*var styles = {};
  for (var key in Animation.PROPERTY_PREFIXES) {
    var p = Animation.PROPERTY_PREFIXES[key];
    styles[p+'animation'] = 'none';
  }
  goog.style.setStyle(element, styles);*/

  // Create the promise.
  var promise = new goog.Promise(function(resolve, reject) {
    // Resolve the promise when the animation has completed.
    goog.events.listenOnce(element, Animation.END_EVENTS, function(event) {

      if (element[Animation.ACTIVE_PROPERTY] == uid) {
        // Remove any animations.
        if (animation.addClass.length > 0) {
          goog.dom.classlist.removeAll(element, /** @type {!Array.<string>} */ (animation.addClass));
        }

        var styles = {};
        for (var key in Animation.PROPERTY_PREFIXES) {
          var p = Animation.PROPERTY_PREFIXES[key];
          styles[p+'animation'] = 'none';
        }
        goog.style.setStyle(element, styles);

        // Resolve the promise.
        element[Animation.ACTIVE_PROPERTY] = undefined;
        resolve(element);
      } else {
        // Reject the promise (pre-empted).
        window.console.log('Animation.completed pre-empted: ', uid, '(active=', element[Animation.ACTIVE_PROPERTY], ')');
        //reject(element);
      }
    });
  });

  // Update the CSS properties to apply the animation.
  // NOTE: For some reason this needs to be done asynchronous, otherwise if two animations are
  // queued in a row with the same name then the animationend event won't fire.
  //goog.Timer.callOnce(function(){
    if (animation.addClass.length > 0) {
      goog.dom.classlist.addAll(element, /** @type {!Array.<string>} */ (animation.addClass));
    }

    var styles = {};
    for (var key in Animation.PROPERTY_PREFIXES) {
      var p = Animation.PROPERTY_PREFIXES[key];
      styles[p+Animation.CSS.DURATION] = animation.duration + 'ms';
      styles[p+Animation.CSS.TIMING] = animation.timing;
      styles[p+Animation.CSS.DELAY] = animation.delay + 'ms';
      styles[p+Animation.CSS.REPEAT] = animation.repeat;
      styles[p+Animation.CSS.DIRECTION] = animation.direction;
      styles[p+Animation.CSS.FILL] = animation.fill;
      styles[p+Animation.CSS.STATE] = animation.state;
      styles[p+Animation.CSS.NAME] = animation.name;
    }
    goog.style.setStyle(element, styles);
  //}, 0);

  // Create a new promise.
  return promise;
};


/**
 * Creates a function that applies the given animation to a given element.
 * The returned function can be called at a later point in time (useful for chaining in Promises).
 * @param {!Animation.Animation|string} animation
 * @return {function(!Element): !goog.Promise.<!Element>}
 */
Animation.create = function(animation) {
  return function(element) {
    return Animation.perform(element, animation);
  };
};



/**
 * @param {number} delay
 * @return {function(!Element): !goog.Promise.<!Element>}
 */
Animation.wait = function(delay) {
  return function(element) {
    //var uid = Animation.ID_GENERATOR.getNextUniqueId();
    //element[Animation.ACTIVE_PROPERTY] = uid;
    //window.console.log('Animation.wait start=', uid);
    return new goog.Promise(function(resolve, reject) {
      goog.Timer.callOnce(function() {
        //window.console.log('Animation.wait complete=', uid, 'active=', element[Animation.ACTIVE_PROPERTY]);
        //if (element[Animation.ACTIVE_PROPERTY] == uid) {
        //  element[Animation.ACTIVE_PROPERTY] = undefined;
          resolve(element);
        //} else {
          //reject(null);
        //}
      }, delay);
    });
  };
};


/**
 * Applies the given preset animation(s) (from Animation.Preset) to an
 * element over the given time period (or uses the default if not specified).
 * Returns a promise that resolves when the animation completes.
 * @param {!Element} element
 * @param {string|!Array.<string>} animations
 * @param {number=} opt_animationTimeMs
 * @return {!goog.Promise.<!Element>}
 */
Animation.start = function(element, animations, opt_animationTimeMs) {
  var animationTimeMs = opt_animationTimeMs || Animation.DEFAULT_DURATION;

  // Ensure animations is always an array.
  if (typeof animations == 'string') {
    animations = [animations];
  }

  // Add base class to list of presets.
  animations.unshift(Animation.BASE_CLASS);

  // Remove any preset animation classes.
  goog.dom.classlist.removeAll(element, Object.keys(Animation.Preset).map(function(key) {
      return Animation.Preset[key];
  }));

  // Add classes to perform animation.
  goog.dom.classlist.addAll(element, animations);

  for (var i = 0; i < Animation.END_EVENTS.length; i++) {
    goog.events.removeAll(element, Animation.END_EVENTS[i]);
  }

  return new goog.Promise(function(resolve, reject) {
    goog.events.listenOnce(element, Animation.END_EVENTS, function(event) {
      resolve(element);
    });
  });
};


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
