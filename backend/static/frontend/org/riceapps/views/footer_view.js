goog.provide('org.riceapps.views.FooterView');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.string');
goog.require('org.riceapps.views.CourseView');
goog.require('org.riceapps.views.View');

goog.scope(function() {



/**
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.FooterView = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.views.FooterView,
              org.riceapps.views.View);
var FooterView = org.riceapps.views.FooterView;


/** @enum {string} */
FooterView.Theme = {
  BASE: 'footer-view',
  LINKS: 'footer-view-links'
};


/** @const {!Object.<string, string>} */
FooterView.LINKS = {
  'Source Code': 'https://github.com/mschurr/rice-schedule-planner',
  'Feedback' : 'mailto:mschurr@rice.edu',
  'Bugs' : 'mailto:mschurr@rice.edu',
  'Feature Requests' : 'mailto:mschurr@rice.edu'
};


/**
 * @override
 */
FooterView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), FooterView.Theme.BASE);
  this.getElement().innerHTML = '&copy; 2014 Rice University Computer Science Club';

  var footerLinks = goog.dom.createDom(goog.dom.TagName.SPAN, FooterView.Theme.LINKS);
  goog.dom.appendChild(this.getElement(), footerLinks);

  for (var key in FooterView.LINKS) {
    var link = goog.dom.createDom(goog.dom.TagName.A);
    goog.dom.setTextContent(link, key);
    link.href = FooterView.LINKS[key];

    if (!goog.string.startsWith(FooterView.LINKS[key], 'mailto:')) {
      link.target = '_blank';
    }

    goog.dom.appendChild(footerLinks, link);
  }
};


/**
 * @override
 */
FooterView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('FooterView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};

}); // goog.scope
