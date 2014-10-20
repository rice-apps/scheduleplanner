goog.provide('org.riceapps.views.PlaygroundView');

goog.require('org.riceapps.views.CourseView');
goog.require('org.riceapps.views.DraggableView.DropTarget');
goog.require('org.riceapps.views.View');

goog.scope(function() {



/**
 * @extends {org.riceapps.views.View}
 * @implements {org.riceapps.views.DraggableView.DropTarget}
 * @constructor
 */
org.riceapps.views.PlaygroundView = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.views.PlaygroundView,
              org.riceapps.views.View);
var PlaygroundView = org.riceapps.views.PlaygroundView;


/** @enum {string} */
PlaygroundView.Theme = {
  BASE: 'playground-view'
};


/**
 * @override
 */
PlaygroundView.prototype.getDropContainers = function() {
  return [this.getElementStrict()];
};


/**
 * @override
 */
PlaygroundView.prototype.drop = function(item) {
  window.console.log('PlaygroundView.drop');
};


/**
 * @override
 */
PlaygroundView.prototype.dragEnter = function(item) {
  window.console.log('PlaygroundView.dragEnter');
  goog.style.setStyle(this.getElement(), {
    'cursor': 'pointer'
  });
};


/**
 * @override
 */
PlaygroundView.prototype.dragLeave = function(item) {
  window.console.log('PlaygroundView.dragLeave');
  goog.style.setStyle(this.getElement(), {
    'cursor': 'auto'
  });
};


/**
 * @override
 */
PlaygroundView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), PlaygroundView.Theme.BASE);
};


/**
 * @override
 */
PlaygroundView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('PlaygroundView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};

}); // goog.scope
