goog.provide('org.riceapps.views.PlaygroundView');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('org.riceapps.events.ViewEvent');
goog.require('org.riceapps.views.CourseView');
goog.require('org.riceapps.views.DraggableView.DropTarget');
goog.require('org.riceapps.views.DraggableView');
goog.require('org.riceapps.views.View');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('goog.events.BrowserEvent');

goog.scope(function() {
var ViewEvent = org.riceapps.events.ViewEvent;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;
var DraggableView = org.riceapps.views.DraggableView;



/**
 * @extends {org.riceapps.views.View}
 * @implements {org.riceapps.views.DraggableView.DropTarget}
 * @constructor
 */
org.riceapps.views.PlaygroundView = function() {
  goog.base(this);

  /** @type {boolean} */
  this.directionsShown_ = false;

  /** @type {Element} */
  this.directionsElement_ = null;
};
goog.inherits(org.riceapps.views.PlaygroundView,
              org.riceapps.views.View);
var PlaygroundView = org.riceapps.views.PlaygroundView;


/** @enum {string} */
PlaygroundView.Theme = {
  BASE: 'playground-view',
  DIRECTIONS: 'playground-view-directions',
  CLEAR_ITEMS: 'clear-playground'
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

  this.clearPlaygroundElement_ = goog.dom.createDom(goog.dom.TagName.DIV, PlaygroundView.Theme.CLEAR_ITEMS);
  goog.dom.appendChild(this.getElement(), this.clearPlaygroundElement_);
  goog.dom.setTextContent(this.clearPlaygroundElement_, 'Clear Staging Area');
  goog.style.setElementShown(this.clearPlaygroundElement_, false);

  this.directionsElement_ = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(this.directionsElement_, PlaygroundView.Theme.DIRECTIONS);
  goog.dom.setTextContent(this.directionsElement_, 'Staging Area');
  goog.dom.appendChild(this.getElement(), this.directionsElement_);

  var directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(directionsSpan,
    'You can use this area to hold courses that you are considering taking.');
  goog.dom.appendChild(this.directionsElement_, directionsSpan);

  directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(directionsSpan,
    'You can find courses by using the search box above and dragging the results here.');
  goog.dom.appendChild(this.directionsElement_, directionsSpan);

  directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(directionsSpan,
    'You can also drag courses freely between the staging area and calendar.');
  goog.dom.appendChild(this.directionsElement_, directionsSpan);

  directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(directionsSpan,
    'To remove a course, drag it to the trash can.');
  goog.dom.appendChild(this.directionsElement_, directionsSpan);

  directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(directionsSpan,
    'You can click on any course to view additional information, or right click any course for additional options.');
  goog.dom.appendChild(this.directionsElement_, directionsSpan);

  this.showDirections_();
};


/**
 * @override
 */
PlaygroundView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('PlaygroundView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};


/**
 * @return {void}
 * @private
 */
PlaygroundView.prototype.showDirections_ = function() {
  if (this.directionsShown_) {
    return;
  }

  goog.style.setElementShown(this.directionsElement_, true);
  this.directionsShown_ = true;
};


/**
 * @return {void}
 * @private
 */
PlaygroundView.prototype.hideDirections_ = function() {
  if (!this.directionsShown_) {
    return;
  }

  goog.style.setElementShown(this.directionsElement_, false);
  this.directionsShown_ = false;
};


/**
 * @override
 */
PlaygroundView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this,
      [ViewEvent.Type.CHILD_ADDED, ViewEvent.Type.CHILD_REMOVED], this.handleChildrenChanged_).
      listen(this.clearPlaygroundElement_, goog.events.EventType.CLICK, this.onClearPlaygroundClick_);
};


/**
 * @override
 */
PlaygroundView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().unlisten(this,
      [ViewEvent.Type.CHILD_ADDED, ViewEvent.Type.CHILD_REMOVED], this.handleChildrenChanged_).
      unlisten(this.clearPlaygroundElement_, goog.events.EventType.CLICK, this.onClearPlaygroundClick_);
};


/**
 * @param {!org.riceapps.events.ViewEvent} event
 */
PlaygroundView.prototype.handleChildrenChanged_ = function(event) {
  if (this.hasChildren()) {
    this.hideDirections_();
  } else {
    this.showDirections_();
  }

  if (this.clearPlaygroundElement_) {
    goog.style.setElementShown(this.clearPlaygroundElement_, this.hasChildren());
  }
}

/**
 * Event handler; called when crn button is clicked. Shows a modal view containing all current CRNs in schedule.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
PlaygroundView.prototype.onClearPlaygroundClick_ = function(event) {
  if (event != null) {
    var new_event = new SchedulePlannerEvent(SchedulePlannerEvent.Type.CLEAR_PLAYGROUND_CLICK);
    this.dispatchEvent(new_event);
  }
}

}); // goog.scope
