goog.provide('org.riceapps.utils.DomUtils');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');

goog.scope(function() {
var DomUtils = org.riceapps.utils.DomUtils;



/**
 * Returns the computed size of an element.
 * @param {!Element} element
 * @return {!goog.math.Size}
 */
DomUtils.getComputedSize = function(element) {
  return goog.style.getSize(element);
};


/**
 * Returns the computed size of an element.
 * @param {!Element} element
 * @return {!goog.math.Size}
 */
DomUtils.getComputedInnerSize = function(element) {
  return goog.style.getContentBoxSize(element);
};


/**
 * @param {number} scrollTop
 */
DomUtils.setDocumentScroll = function(distance) {
  distance = Math.max(Math.min(distance, DomUtils.getDocumentHeight()), 0);

  var scroll = goog.dom.getDocumentScroll();
  window.scroll(scroll.x, distance);
};


/**
 * @return {number}
 */
DomUtils.getDocumentHeight = function() {
  var body = document.body,
      html = document.documentElement;

  var height = Math.max(body.scrollHeight, body.offsetHeight,
                        html.clientHeight, html.scrollHeight, html.offsetHeight);

  return height;
};


/**
 * @param {!Elemenet} element
 * @param {goog.math.Rect} rect
 * @param {goog.math.Rect=} opt_adjust
 */
DomUtils.applyRect = function(element, rect, opt_adjust) {
    if (opt_adjust) {
      rect = new goog.math.Rect(
        rect.left - opt_adjust.left,
        rect.top - opt_adjust.top,
        rect.width - opt_adjust.width,
        rect.height - opt_adjust.height
      );
    }

    goog.style.setStyle(element, {
      'position': 'absolute',
      'top' : rect.top + 'px',
      'left' : rect.left + 'px',
      'width': rect.width + 'px',
      'height': rect.height + 'px'
    });

    /*var actualSize = goog.style.getSize(element);
    goog.style.setStyle(element, {
      'width': (rect.width + (rect.width - actualSize.width)) + 'px',
      'height': (rect.height + (rect.height - actualSize.height)) + 'px'
    });

    var actualSize = goog.style.getSize(element);*/
};


/**
 * @param {string} name
 * @param {string} value
 * @param {string} text
 * @param {boolean=} opt_checked
 */
DomUtils.createCheckbox = function(name, value, text, opt_checked) {
  var checked = !!opt_checked;

  var container = goog.dom.createDom(goog.dom.TagName.DIV);

  var label = goog.dom.createDom(goog.dom.TagName.LABEL, {
    'for': name
  });

  goog.dom.setTextContent(label, text);

  var checkbox = goog.dom.createDom(goog.dom.TagName.INPUT, {
    'type': 'checkbox',
    'name': name,
    'value': value
  });

  if (checked) {
    goog.dom.setProperties(checkbox, {'checked': 'checked'});
  }

  goog.dom.appendChild(container, checkbox);
  goog.dom.appendChild(container, label);
  return container;
};


/**
 * Creates and returns a selection box with the provided properties.
 * @param {string} name
 * @param {!Object.<string, string>} options
 * @param {(string)=} opt_selected
 * @return {!Element}
 */
DomUtils.createSelectionBox = function(name, options, opt_selected) {
  var select = goog.dom.createDom(goog.dom.TagName.SELECT, {
    'name': name
  });

  for (var key in options) {
    var attributes = {'value': key};

    if (key === opt_selected) {
      attributes['selected'] = 'selected';
    }

    var option = goog.dom.createDom(goog.dom.TagName.OPTION, attributes);

    goog.dom.setTextContent(option, options[key]);
    goog.dom.appendChild(select, option);
  }

  return select;
};

});  // goog.scope
