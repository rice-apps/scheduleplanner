goog.provide('org.riceapps.views.SearchView');

goog.require('goog.Timer');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('org.riceapps.fx.Animation');
goog.require('org.riceapps.views.View');
goog.require('org.riceapps.utils.DomUtils');


goog.scope(function() {
var Animation = org.riceapps.fx.Animation;
var DomUtils = org.riceapps.utils.DomUtils;



/**
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.SearchView = function() {
  goog.base(this);

  /** @private {number} */
  this.hideTimer_ = -1;

  /** @private {Element} */
  this.resultsContainer_ = null;
};
goog.inherits(org.riceapps.views.SearchView,
              org.riceapps.views.View);
var SearchView = org.riceapps.views.SearchView;


/**
 * @enum {string}
 */
SearchView.Theme = {
  BASE: 'search-view',
  COLUMNS: 'search-view-columns',
  RESULTS: 'search-view-results',
  FILTERS: 'search-view-filters',
  RESULTS_CONTAINER: 'search-view-results-container'
};


/**
 * @override
 */
SearchView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), SearchView.Theme.BASE);

  var columns = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.COLUMNS);
  goog.dom.appendChild(this.getElement(), columns);

  var results = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.RESULTS);
  goog.dom.appendChild(columns, results);

  var resultsContainer = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.RESULTS_CONTAINER);
  goog.dom.appendChild(results, resultsContainer);
  this.resultsContainer_ = resultsContainer;

  var filters = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.FILTERS);
  goog.dom.appendChild(columns, filters);
  this.createFiltersDom(filters);
};


/**
 * @param {!Element} container
 */
SearchView.prototype.createFiltersDom = function(container) {
  var normal = DomUtils.createCheckbox('nd', '1', 'Non-Distribution', true);
  var d1 = DomUtils.createCheckbox('d[]', '1', 'Distribution 1', true);
  var d2 = DomUtils.createCheckbox('d[]', '2', 'Distribution 2', true);
  var d3 = DomUtils.createCheckbox('d[]', '3', 'Distribution 3', true);
  var conflicts = DomUtils.createCheckbox('filter_conflicts', '1', 'Hide conflicts');
  var full = DomUtils.createCheckbox('filter_full', '1', 'Hide full courses');
  // credit hours
  // school
  // department
  // instructor

  goog.dom.appendChild(container, normal);
  goog.dom.appendChild(container, d1);
  goog.dom.appendChild(container, d2);
  goog.dom.appendChild(container, d3);
  goog.dom.appendChild(container, conflicts);
  goog.dom.appendChild(container, full);
};


/**
 * @override
 */
SearchView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.hide(true);
};


/**
 * @override
 */
SearchView.prototype.show = function(opt_preventAnimation) {
  if (this.isShown()) {
    return;
  }

  if (this.hideTimer_ != -1) {
    goog.Timer.clear(this.hideTimer_);
    this.hideTimer_ = -1;
  }

  goog.base(this, 'show', opt_preventAnimation);
  goog.style.setElementShown(this.getElement(), true);

  goog.dom.classlist.removeAll(this.getElement(),
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN_RIGHT_BIG, Animation.Preset.FADE_OUT_RIGHT_BIG]);

  if(!opt_preventAnimation) {
    goog.dom.classlist.addAll(this.getElement(), [Animation.BASE_CLASS, Animation.Preset.FADE_IN_RIGHT_BIG]);
  }
};


/**
 * @override
 */
SearchView.prototype.hide = function(opt_preventAnimation) {
  if (!this.isInDocument() || this.isHidden()) {
    return;
  }

  goog.base(this, 'hide', opt_preventAnimation);

  goog.dom.classlist.removeAll(this.getElement(),
      [Animation.BASE_CLASS, Animation.Preset.FADE_IN_RIGHT_BIG, Animation.Preset.FADE_OUT_RIGHT_BIG]);

  if(!opt_preventAnimation) {
    goog.dom.classlist.addAll(this.getElement(), [Animation.BASE_CLASS, Animation.Preset.FADE_OUT_RIGHT_BIG]);
    this.hideTimer_ = goog.Timer.callOnce(function() {
      goog.style.setElementShown(this.getElement(), false);
      this.hideTimer_ = -1;
    }, 300, this);
  } else {
    goog.style.setElementShown(this.getElement(), false);
  }
};


/**
 * @param {boolean} isLoading
 */
SearchView.prototype.setLoading = function(isLoading) {

};


/**
 * @param {!Array.<!org.riceapps.views.CourseSearchView>} results
 */
SearchView.prototype.setSearchResults = function(results) {
  this.removeChildren(true);

  for (var i = 0; i < results.length; i++) {
    this.addChild(results[i], true);
  }
};


/**
 * @override
 */
SearchView.prototype.getContentElement = function() {
  return this.resultsContainer_;
};


});
