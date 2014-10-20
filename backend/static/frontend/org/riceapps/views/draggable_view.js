goog.provide('org.riceapps.views.DraggableView');
goog.provide('org.riceapps.views.DraggableView.DropTarget');
goog.provide('org.riceapps.views.DraggableView.Event');
goog.provide('org.riceapps.views.DraggableView.EventType');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.Event');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger');  // for goog.fx.Dragger.cloneNode
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('org.riceapps.utils.DomUtils');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var DomUtils = org.riceapps.utils.DomUtils;



/**
 * An abstract implementation of a view that can be dragged by the user. You should not use this view directly; rather,
 * subclass it and create the content you wish to be dragged in createDom.
 *
 * FEATURES STILL NEEDING TO BE IMPLEMENTED:
 *  - animate drag handle back to element position when drag ends but no drop
 *
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.DraggableView = function() {
  goog.base(this);

  /** @private {boolean} */
  this.isBeingDragged_ = false;

  /** @private {Element} */
  this.dragTooltip_ = null;

  /** @private {goog.math.Coordinate} */
  this.dragTooltipPosition_ = null;

  /** @private {goog.math.Coordinate} */
  this.pageScroll_ = null;

  /** @private {!Array.<!DraggableView.DropTarget>} */
  this.targets_ = [];

  /** @private {!DraggableView.DropTarget} */
  this.lastTarget_ = null;

  /** @private {goog.math.Coordinate} */
  this.dragStartCoordinate_ = null;
};
goog.inherits(org.riceapps.views.DraggableView,
              org.riceapps.views.View);
var DraggableView = org.riceapps.views.DraggableView;



/**
 * Represents an item on which DraggableViews can be dropped.
 * @interface
 */
DraggableView.DropTarget = function() {};


/**
 * Returns the container elements that represent the drop target. The user may drop an item on any of these containers
 * (or on any of the elements contained within them).
 * @return {!Array.<!Element>}
 */
DraggableView.DropTarget.prototype.getDropContainers = function() {};


/**
 * Event handler; called when an item is dropped on the target.
 * @param {!DraggableView} item
 */
DraggableView.DropTarget.prototype.drop = function(item) {};


/**
 * Event handler; called when an item is first dragged over the target.
 * @param {!DraggableView} item
 */
DraggableView.DropTarget.prototype.dragEnter = function(item) {};


/**
 * Event handler; called when an item is no longer being dragged over the target.
 * @param {!DraggableView} item
 */
DraggableView.DropTarget.prototype.dragLeave = function(item) {};


/**
 * Bounding size for generated tooltips; the tooltip will be scaled down to fit within a box of this size.
 * @const {!goog.math.Size}
 */
DraggableView.TOOLTIP_BOUND = new goog.math.Size(250, 250);


/**
 * When the user drags an element within this many pixels of the edge of the screen, a scroll should be triggered.
 * @const {number}
 */
DraggableView.SCROLL_TRIGGER_DISTANCE = 100;


/**
 * @enum {string}
 */
DraggableView.EventType = {
  DRAGSTART: 'draggable_view_' + goog.events.EventType.DRAGSTART,
  DRAGEND: 'draggable_view_' + goog.events.EventType.DRAGEND,
  DRAGENTER: 'draggable_view_' + goog.events.EventType.DRAGENTER,
  DRAGLEAVE: 'draggable_view_' + goog.events.EventType.DRAGLEAVE,
  DROP: 'draggable_view_' + goog.events.EventType.DROP,
  CLICK: 'draggable_view_' + goog.events.EventType.CLICK,
  DROPPED: 'draggable_view_dropped'
};


/**
 * @param {!DraggableView.DropTarget} target
 */
DraggableView.prototype.addDropTarget = function(target) {
  this.targets_.push(target);
};


/**
 * @param {!DraggableView.DropTarget} target
 */
DraggableView.prototype.removeDropTarget = function(target) {
  goog.array.remove(this.targets_, target);
};


/**
 * Returns the element that will be shown beneath the mouse cursoe when dragging.
 * The returned element should not be rendered in the DOM tree.
 * The default implementation returns a scaled-down copy of the view's element. Override if neccesary.
 * @return {!Element}
 */
DraggableView.prototype.getDragTooltip = function() {
  return this.makeTooltipFromElement(this.getElementStrict());
};


/**
 * @param {!Element} originalElement
 * @return {!Element}
 */
DraggableView.prototype.makeTooltipFromElement = function(originalElement) {
  var element = goog.fx.Dragger.cloneNode(originalElement);
  var size = DomUtils.getComputedInnerSize(originalElement);
  var scaleX = DraggableView.TOOLTIP_BOUND.width / size.width;
  var scaleY = DraggableView.TOOLTIP_BOUND.height / size.height;
  var scale = Math.min(Math.min(scaleX, scaleY), 1.0);

  goog.style.setStyle(element, {
    'transform': 'scale(' + scale + ', ' + scale + ')',
    'transform-origin': '0 0',
    'opacity': '0.7',
    'position': 'absolute',
    'top': '0px',
    'left': '0px',
    'box-shadow': '0px 0px 50px #000',
    'z-index': '10',
    'width': size.width + 'px',
    'height': size.height + 'px'
  });

  return element;
};


/**
 * @param {!Element} originalElement
 * @return {!Element}
 */
DraggableView.prototype.cloneElement = function(originalElement) {
  return goog.fx.Dragger.cloneNode(originalElement);
};


/**
 * @override
 */
DraggableView.prototype.createDom = function() {
  goog.base(this, 'createDom');

  goog.style.setStyle(this.getElement(), {
    'cursor': '-webkit-grab'
  });
};


/**
 * @override
 */
DraggableView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(this.getElement(), goog.events.EventType.MOUSEDOWN, this.handleMouseDown_).
    listen(this.getElement(), goog.events.EventType.CLICK, this.handleMouseClick_).
    listen(this.getElement(), goog.events.EventType.DRAGSTART, this.handleDragStart_);
};


/**
 * @override
 */
DraggableView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  if (this.isBeingDragged_) {
    this.stopDragging_();
  }

  this.getHandler().
    unlisten(this.getElement(), goog.events.EventType.MOUSEDOWN, this.handleMouseDown_).
    unlisten(this.getElement(), goog.events.EventType.CLICK, this.handleMouseClick_).
    unlisten(this.getElement(), goog.events.EventType.DRAGSTART, this.handleDragStart_);
};


/**
 * @param {!goog.events.BrowserEvent}
 */
DraggableView.prototype.handleMouseUp_ = function(event) {
  event.preventDefault();
  this.debugLog_('handleMouseUp_', event);
  this.stopDragging_(event);
};


/**
 * @param {!goog.events.BrowserEvent}
 */
DraggableView.prototype.handleMouseClick_ = function(event) {
  this.debugLog_('handleMouseClick_', event);
  event.preventDefault();

  if (this.isBeingDragged_) {
    this.stopDragging_(event);
  } else if (this.dragStartCoordinate_) {
    this.debugLog_('self.dispatch.click');
    this.stopDragging_(event);
    event.target = this;
    event.type = DraggableView.EventType.CLICK;
    this.dispatchEvent(event);
  }
};



/**
 * @param {!goog.events.BrowserEvent}
 */
DraggableView.prototype.handleMouseDown_ = function(event) {
  if (event.button != 0) {
    return;
  }

  this.debugLog_('handleMouseDown_', event);
  event.preventDefault();

  if (this.dragStartCoordinate_ == null) {
    this.debugLog_('initializeMaybeStartDrag_');
    this.dragStartCoordinate_ = new goog.math.Coordinate(event.clientX, event.clientY);
    this.getHandler().listen(window, goog.events.EventType.MOUSEMOVE, this.maybeStartDrag_);
  }
};


/**
 * @param {!goog.events.BrowserEvent} event
 */
DraggableView.prototype.maybeStartDrag_ = function(event) {
  this.debugLog_('maybeStartDrag_', event);
  var position = new goog.math.Coordinate(event.clientX, event.clientY);

  if (goog.math.Coordinate.distance(position, this.dragStartCoordinate_) > 15 &&
      !this.isBeingDragged_) {
    this.startDragging_(position);
  }
};


/**
 * @param {!goog.events.BrowserEvent}
 */
DraggableView.prototype.handleDragStart_ = function(event) {
  this.debugLog_('handleDragStart_', event);
  event.preventDefault();
  event.stopPropogation();
};


/**
 * @param {!DraggableView.DropTarget} target
 */
DraggableView.prototype.dragOver_ = function(target) {
  if (target === this.lastTarget_) {
    return;
  }

  if (this.lastTarget_) {
    this.debugLog_('dispatch.target.dragout', this.lastTarget_);
    this.lastTarget_.dragLeave(this);
  }

  if (target) {
    this.debugLog_('dispatch.target.dragenter', target);
    target.dragEnter(this);
  }

  this.lastTarget_ = target;
};


/**
 * @param {!DraggableView.Target} target
 * @param {!Element} element
 */
DraggableView.prototype.targetContainsElement_ = function(target, element) {
  var elements = target.getDropContainers();

  for (var i = 0; i < elements.length; i++) {
    if (goog.dom.contains(elements[i], element)) {
      return true;
    }
  }

  return false;
};


/**
 * @param {!goog.events.BrowserEvent}
 */
DraggableView.prototype.handleMouseMove_ = function(event) {
  var i;
  for (i = 0; i < this.targets_.length; i++) {
    if (this.targetContainsElement_(this.targets_[i], event.target)) {
      this.dragOver_(this.targets_[i]);
      break;
    }
  }

  if (i == this.targets_.length) {
    this.dragOver_(null);
  }

  this.moveDragTooltipTo_(new goog.math.Coordinate(event.clientX, event.clientY));
};


/**
 * @param {!goog.events.BrowserEvent} event
 */
DraggableView.prototype.handleMouseOut_ = function(event) {
  if (!event.relatedTarget || event.relatedTarget.tagName == goog.dom.TagName.HTML) {
    this.debugLog_('handleMouseOut_', event);
    this.stopDragging_();
  }
};


/**
 * @param {goog.events.BrowserEvent} event
 */
DraggableView.prototype.handleWindowBlur_ = function(event) {
  this.debugLog_('handleWindowBlur_', event);
  this.stopDragging_();
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 */
DraggableView.prototype.handleScroll_ = function(opt_event) {
  this.debugLog_('handleScroll_', opt_event);
  this.pageScroll_ = goog.dom.getDomHelper(this.document_).getDocumentScroll();
  this.moveDragTooltipTo_(this.dragTooltipPosition_);
};


/**
 * @param {!goog.math.Coordinate} position
 */
DraggableView.prototype.moveDragTooltipTo_ = function(position) {
  var viewport = goog.dom.getViewportSize();
  var tooltip = goog.style.getTransformedSize(this.dragTooltip_);
  goog.style.setPosition(this.dragTooltip_,
      Math.min(10 + position.x + this.pageScroll_.x, viewport.width - tooltip.width - 30),
      Math.min(10 + position.y + this.pageScroll_.y, DomUtils.getDocumentHeight() - 30 - tooltip.height));
  this.dragTooltipPosition_ = position;

  if (viewport.height - position.y < DraggableView.SCROLL_TRIGGER_DISTANCE) {
    DomUtils.setDocumentScroll(this.pageScroll_.y +
        (DraggableView.SCROLL_TRIGGER_DISTANCE - (viewport.height - position.y)));
  }

  if (position.y < DraggableView.SCROLL_TRIGGER_DISTANCE) {
    DomUtils.setDocumentScroll(this.pageScroll_.y - (DraggableView.SCROLL_TRIGGER_DISTANCE - position.y));
  }
};


/**
 * @param {goog.events.BrowserEvent} event
 * @return {DraggableView.DropTarget}
 */
DraggableView.prototype.maybeDrop_ = function(event) {
  this.debugLog_('maybeDrop_', event);

  for (var i = 0; i < this.targets_.length; i++) {
    if (this.targetContainsElement_(this.targets_[i], event.target)) {
      return this.targets_[i];
      break;
    }
  }

  return null;
};


/**
 * @param {!DraggableView.DropTarget} target
 */
DraggableView.prototype.drop_ = function(target) {
  this.debugLog_('drop_', target);
  target.drop(this);
  var event = new DraggableView.Event(DraggableView.EventType.DROPPED);
  event.dropTarget = target;
  this.dispatchEvent(event);
};


/**
 * @param {goog.events.BrowserEvent} event
 */
DraggableView.prototype.onMouseEnterTarget_ = function(event) {
  this.debugLog_('onMouseEnterTarget_', event);
};


/**
 * @param {goog.events.BrowserEvent} event
 */
DraggableView.prototype.onMouseLeaveTarget_ = function(event) {
  this.debugLog_('onMouseLeaveTarget_', event);
};


/**
 * @private
 */
DraggableView.prototype.clearMaybeDrag_ = function() {
  this.debugLog_('clearMaybeDrag_');
  this.getHandler().unlisten(window, goog.events.EventType.MOUSEMOVE, this.maybeStartDrag_);
  this.dragStartCoordinate_ = null;
};


/**
 * @param {goog.math.Coordinate} initialPosition
 * @private
 */
DraggableView.prototype.startDragging_ = function(initialPosition) {
  this.debugLog_('startDragging_');
  this.clearMaybeDrag_();
  this.isBeingDragged_ = true;
  this.dragTooltip_ = this.getDragTooltip();
  this.pageScroll_ = goog.dom.getDomHelper(this.document_).getDocumentScroll();
  goog.dom.appendChild(document.body, this.dragTooltip_);

  var styles = {
    'cursor': '-webkit-grabbing'
  };
  goog.style.setStyle(document.body, styles);
  goog.style.setStyle(this.dragTooltip_, styles);
  goog.style.setStyle(this.getElement(), styles);

  if (initialPosition) {
    this.moveDragTooltipTo_(initialPosition);
  }

  this.getHandler().
      listen(document, goog.events.EventType.MOUSEUP, this.handleMouseUp_).
      listen(window, goog.events.EventType.MOUSEMOVE, this.handleMouseMove_).
      listen(document, goog.events.EventType.MOUSEOUT, this.handleMouseOut_).
      listen(window, goog.events.EventType.BLUR, this.handleWindowBlur_).
      listen(window, goog.events.EventType.SCROLL, this.handleScroll_);

  this.dispatchEvent(new goog.events.Event(DraggableView.EventType.DRAGSTART));
  this.debugLog_('dispatch.self.dragStart');
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
DraggableView.prototype.stopDragging_ = function(opt_event) {
  this.debugLog_('stopDragging_');
  if (!this.isBeingDragged_) {
    this.clearMaybeDrag_();
    return;
  }

  goog.dom.removeNode(this.dragTooltip_);
  this.isBeingDragged_ = false;
  this.dragTooltip_ = null;
  this.dragTooltipPosition_ = null;
  this.pageScroll_ = null;
  this.dragStartCoordinate_ = null;
  this.dragOver_(null);

  goog.style.setStyle(document.body, {
    'cursor': 'auto'
  });

  goog.style.setStyle(this.getElement(), {
    'cursor': '-webkit-grab'
  });

  this.getHandler().
      unlisten(document, goog.events.EventType.MOUSEUP, this.handleMouseUp_).
      unlisten(window, goog.events.EventType.MOUSEMOVE, this.handleMouseMove_).
      unlisten(document, goog.events.EventType.MOUSEOUT, this.handleMouseOut_).
      unlisten(window, goog.events.EventType.BLUR, this.handleWindowBlur_).
      unlisten(window, goog.events.EventType.SCROLL, this.handleScroll_);

  this.debugLog_('dispatch.self.dragEnd');

  var target = null;
  if (opt_event) {
    target = this.maybeDrop_(opt_event);
  }

  this.dispatchEvent(new goog.events.Event(DraggableView.EventType.DRAGEND));

  if (target) {
    this.drop_(target);
  }
};


/**
 * @return {boolean}
 */
DraggableView.prototype.isBeingDragged = function() {
  return this.isBeingDragged_;
};


/**
 * @param {...Object} var_args
 */
DraggableView.prototype.debugLog_ = function(var_args) {
  //window.console.log('[DraggableView] @' + goog.getUid(this), arguments);
};



/**
 * @param {DraggableView.EventType} type
 * @extends {goog.events.Event}
 * @constructor
 */
DraggableView.Event = function(type) {
  goog.base(this, type);

  /** @type {DraggableView.DropTarget} */
  this.dropTarget = null;
};
goog.inherits(DraggableView.Event,
              goog.events.Event);

}); // goog.scope
