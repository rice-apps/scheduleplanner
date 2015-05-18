/**
 * Provides a generic implementation for a context (right click) menu.
 */

goog.provide('org.riceapps.views.ContextMenuView');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.structs.Map');
goog.require('goog.style');
goog.require('org.riceapps.events.ContextMenuEvent');
goog.require('org.riceapps.events.ContextMenuEvent.Type');
goog.require('org.riceapps.views.View');
goog.require('org.riceapps.utils.DomUtils');

goog.scope(function() {
var DomUtils = org.riceapps.utils.DomUtils;
var ContextMenuEvent = org.riceapps.events.ContextMenuEvent;



/**
 * @param {number} documentX
 * @param {number} documentY
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.ContextMenuView = function(documentX, documentY) {
  goog.base(this);

  /** @private {number} */
  this.documentX_ = documentX;

  /** @private {number} */
  this.documentY_ = documentY;

  /** @private {!goog.structs.Map.<number, ContextMenuView.Option>} */
  this.options_ = new goog.structs.Map();

  /** @private {!goog.events.EventHandler} */
  this.optionEventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.optionEventHandler_);

};
goog.inherits(org.riceapps.views.ContextMenuView,
              org.riceapps.views.View);
var ContextMenuView = org.riceapps.views.ContextMenuView;


/** @enum {string} */
ContextMenuView.Theme = {
  BASE: 'context-menu-view',
  OPTION: 'context-menu-view-option'
};


/**
 * @typedef {{
 *  id: number,
 *  text: string,
 *  icon: (string|undefined)
 * }}
 */
ContextMenuView.Option;


/**
 * @param {number} id A unique identifier for the option.
 * @param {string} text Text describing the option.
 * @param {string=} opt_icon An icon for the option (optional).
 */
ContextMenuView.prototype.setOption = function(id, text, opt_icon) {
  this.options_.set(id, /** @type {ContextMenuView.Option} */ ({
    id: id,
    text: text,
    icon: opt_icon
  }));

  this.relayout();
};


/**
 * @override
 */
ContextMenuView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
      listen(document, goog.events.EventType.KEYUP, this.handleKeyUp_).
      listen(document, goog.events.EventType.MOUSEOUT, this.handleMouseOut_).
      listen(window, goog.events.EventType.BLUR, this.handleWindowBlur_).
      listen(window, goog.events.EventType.SCROLL, this.handleScroll_).
      listen(document, goog.events.EventType.MOUSEDOWN, this.handleMouseDown_).
      listen(this.getElement(), goog.events.EventType.CONTEXTMENU, this.handleContextMenu_);
};


/**
 * @override
 */
ContextMenuView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().removeAll();
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ContextMenuView.prototype.handleContextMenu_ = function(event) {
  event.preventDefault(); // Don't let browser context menu show.
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ContextMenuView.prototype.handleMouseDown_ = function(event) {
  if (goog.dom.contains(this.getElement(), event.target)) {
    return; // Don't hide for clicks on the menu itself.
  }

  this.hide();
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ContextMenuView.prototype.handleMouseOut_ = function(event) {
  if (!event.relatedTarget || event.relatedTarget.tagName == goog.dom.TagName.HTML) {
    this.hide();
  }
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ContextMenuView.prototype.handleWindowBlur_ = function(event) {
  this.hide();
};


/**
 * @param {!goog.events.BrowserEvent} event
 * @private
 */
ContextMenuView.prototype.handleScroll_ = function(event) {
  this.hide();
};


/**
 * @param {!goog.events.KeyEvent} event
 * @private
 */
ContextMenuView.prototype.handleKeyUp_ = function(event) {
  if (event.keyCode == goog.events.KeyCodes.ESC) {
    this.hide();
  }
};


/**
 * @override
 */
ContextMenuView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);

  if (!this.isInDocument()) {
    return;
  }

  var root = this.getElementStrict();
  this.optionEventHandler_.removeAll();
  goog.dom.removeChildren(root);

  this.options_.forEach(function(option) {
    var element = goog.dom.createDom(goog.dom.TagName.DIV);
    goog.dom.classlist.add(element, ContextMenuView.Theme.OPTION);
    goog.dom.setTextContent(element, option.text);

    if (option.icon) {
      goog.style.setStyle(element, {
        'background-image': 'url(\'' + option.icon + '\')'
      });
    }

    goog.dom.appendChild(root, element);
    this.optionEventHandler_.listen(element, goog.events.EventType.CLICK, goog.bind(this.handleOptionClick_, this, option.id));
  }, this);
};


/**
 * @param {number} optionId
 * @param {goog.events.BrowserEvent} event
 */
ContextMenuView.prototype.handleOptionClick_ = function(optionId, event) {
  this.dispatchEvent(new ContextMenuEvent(ContextMenuEvent.Type.OPTION_CLICK, optionId));
  this.hide();
};


/**
 * NOTE: Subclasses should override this method to build their content.
 * @override
 */
ContextMenuView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), ContextMenuView.Theme.BASE);
};


/**
 * @override
 */
ContextMenuView.prototype.show = function(opt_preventAnimation) {
  goog.base(this, 'show', opt_preventAnimation);

  // Render the view if it is not already.
  if (!this.isInDocument()) {
    this.render(document.body);
  }

  // Position the element at the appropriate location (based on provided parameters).
  var menuSize = goog.style.getTransformedSize(this.getElementStrict());
  var scroll = goog.dom.getDomHelper().getDocumentScroll();
  var viewport = goog.dom.getViewportSize();
  var pos_x = this.documentX_;
  var pos_y = this.documentY_;

  // Bound horizontally in document.
  if (pos_x < 10) {
    pos_x = 10;
  } else if (pos_x > DomUtils.getDocumentWidth() - 10 - menuSize.width) {
    pos_x = DomUtils.getDocumentWidth() - 10 - menuSize.width;
  }

  // Bound vertically in viewport.
  if (pos_y < 10) {
    pos_y = 10;
  } else if (pos_y > scroll.y + viewport.height - 10 - menuSize.height) {
    pos_y = scroll.y + viewport.height - 10 - menuSize.height;
  }

  goog.style.setPosition(this.getElement(), pos_x, pos_y);
  this.relayout();

  this.dispatchEvent(new ContextMenuEvent(ContextMenuEvent.Type.OPEN));
};


/**
 * @override
 */
ContextMenuView.prototype.hide = function(opt_preventAnimation) {
  goog.base(this, 'hide', opt_preventAnimation);

  this.dispatchEvent(new ContextMenuEvent(ContextMenuEvent.Type.CLOSE));

  // Context menus are discarded once hidden.
  this.dispose();
};

});  // goog.scope
