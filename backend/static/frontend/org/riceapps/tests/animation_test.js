/**
 * Provides an environment in which to test org.riceapps.fx.Animation.
 * NOTE: You can run the test by viewing animation_test.html after building deps.js by running build_dev.sh.
 */

goog.provide('org.riceapps.tests.AnimationTest');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('org.riceapps.controllers.Controller');
goog.require('org.riceapps.fx.Animation');

goog.scope(function() {
var Animation = org.riceapps.fx.Animation;



/**
 * @extends {org.riceapps.controllers.Controller}
 * @constructor
 */
org.riceapps.tests.AnimationTest = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.tests.AnimationTest,
              org.riceapps.controllers.Controller);
var AnimationTest = org.riceapps.tests.AnimationTest;



/**
 * @param  {number} x
 * @param  {number} y
 * @return {!Element}
 */
AnimationTest.prototype.createElement = function(x, y) {
  var element = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.appendChild(document.body, element);
  goog.style.setElementShown(element, false);
  goog.style.setStyle(element, {
    'position': 'absolute',
    'top': y + 'px',
    'left': x + 'px',
    'width': '100px',
    'height': '100px',
    'background-color': 'red'
  });
  return element;
};


/**
 * Runs the test.
 */
AnimationTest.prototype.start = function() {
  // Test window animation.

  /*var element = this.createElement(500, 500);
  Animation.showElement(element).
    then(Animation.create({
      name: 'windowEnter',
      duration: 1000
    })).
    then(Animation.wait(1000)).
    then(Animation.create({
      name: 'windowExit',
      duration: 1000
    }));*/

  // End Test */


  // Test animating a grid of items.
  for (var r = 0; r < 5; r++) {
    for (var c = 0; c < 10; c++) {
      var element = this.createElement(10 + (110 * c), 10 + (110 * r));
      var an = Animation.showElement(element);

      for (var i = 0; i < 1; i++) {
        an = an.
        then(Animation.showElement).
        then(Animation.create({
          name: Animation.Preset.ZOOM_IN,
          duration: 1000,
          delay: (i > 0 ? 0 : c*50 + r*50)
        })).
        then(Animation.wait(1000)).
        then(Animation.create({
          name: Animation.Preset.ZOOM_OUT,
          duration: 1000,
          delay: (i > 0 ? 0 : c*50 + r*50)
        })).
        then(Animation.hideElement);
      }

      goog.events.listen(element, goog.events.EventType.CLICK, function(event) {
        Animation.perform(event.target, {
          name: Animation.Preset.ZOOM_OUT,
          mode: Animation.Mode.AVAILABLE
        }).then(Animation.hideElement);
      });
    }
  }

  // End Test //*/

  /*/ Test for conflicting animations.

  var element = this.createElement(50, 50);

  Animation.showElement(element).
    then(Animation.create(Animation.Preset.FADE_IN_UP)).
    then(Animation.create(Animation.Preset.BOUNCE)).
    then(Animation.create(Animation.Preset.FADE_OUT_DOWN)).
    then(Animation.hideElement);

  Animation.showElement(element).
    then(Animation.create(Animation.Preset.FADE_IN_DOWN)).
    then(Animation.create(Animation.Preset.SHAKE)).
    then(Animation.create(Animation.Preset.FADE_OUT_UP)).
    then(Animation.hideElement);

  // End Test //*/

  /*Animation.
    showElement(element).
    then(Animation.create(Animation.Preset.FADE_IN)).
    then(function(element) { window.console.log('Finished 0!'); });

  Animation.
    showElement(element).
    then(Animation.create(Animation.Preset.BOUNCE_IN_LEFT)).
    then(function(element) { window.console.log('Finished 1!'); });

  Animation.
    showElement(element).
    then(Animation.create(Animation.Preset.FADE_IN_UP)).
    then(function(element) { window.console.log('Finished 2!'); });*/

  /*Animation.
    showElement(element).
    then(Animation.create(Animation.Preset.FADE_IN)).
    then(Animation.create(Animation.Preset.BOUNCE)).
    then(Animation.create(Animation.Preset.BOUNCE_OUT_RIGHT)).
    then(Animation.create(Animation.Preset.BOUNCE_IN_LEFT)).
    then(Animation.create(Animation.Preset.FADE_OUT_DOWN)).
    then(Animation.create(Animation.Preset.FADE_IN_UP)).
    then(Animation.create(Animation.Preset.BOUNCE)).
    then(Animation.create(Animation.Preset.BOUNCE)).
    then(Animation.create(Animation.Preset.FADE_OUT)).
    then(Animation.hideElement).
    then(function(element) { window.console.log('Finished!', element); });*/

};

});  // goog.scope
