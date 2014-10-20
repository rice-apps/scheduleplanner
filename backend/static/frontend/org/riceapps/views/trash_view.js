goog.provide('org.riceapps.views.TrashView');

goog.require('goog.dom.classlist');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.views.View');
goog.require('org.riceapps.views.AbstractCourseView');
goog.require('org.riceapps.views.DraggableView.DropTarget');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



/**
 * @extends {org.riceapps.views.View}
 * @implements {org.riceapps.views.DraggableView.Target}
 * @constructor
 */
org.riceapps.views.TrashView = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.views.TrashView,
              org.riceapps.views.View);
var TrashView = org.riceapps.views.TrashView;


/**
 * @enum {string}
 */
TrashView.Theme = {
  BASE: 'trash-view',
  BASE_HOVER: 'trash-view-hover'
};


/**
 * @override
 */
TrashView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), TrashView.Theme.BASE);
};


/**
 * @override
 */
TrashView.prototype.getDropContainers = function() {
  return [this.getElementStrict()];
};


/**
 * @override
 */
TrashView.prototype.drop = function(item) {};


/**
 * @override
 */
TrashView.prototype.dragEnter = function(item) {
  goog.dom.classlist.add(this.getElement(), TrashView.Theme.BASE_HOVER);
};


/**
 * @override
 */
TrashView.prototype.dragLeave = function(item) {
  goog.dom.classlist.remove(this.getElement(), TrashView.Theme.BASE_HOVER);
};

}); // goog.scope
