goog.provide('org.riceapps.views.SearchView');

goog.require('goog.Timer');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.style');
goog.require('org.riceapps.fx.Animation');
goog.require('org.riceapps.views.View');
goog.require('org.riceapps.utils.DomUtils');
goog.require('org.riceapps.events.SchedulePlannerEvent');


goog.scope(function() {
var Animation = org.riceapps.fx.Animation;
var DomUtils = org.riceapps.utils.DomUtils;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



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

  /** @private {Element} */
  this.filterContainer = null;

  /** @private {string} */
  this.lastQuery = "";

  /** @private {Object.<boolean>} */
  this.lastFilterValues = null;

  /** @private {Object.<!Element>} */
  this.filterElements = {};

  /** @private {Element} */
  this.cancelButton = null;
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
 * @param {string} query
 */
SearchView.prototype.setQuery = function(query) {
  this.lastQuery = query;

  this.updateSearch();
}


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

  this.filterContainer = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.FILTERS);

  this.cancelButton = goog.dom.createDom(goog.dom.TagName.IMG, "close-search-view");
  goog.dom.appendChild(this.filterContainer, this.cancelButton);

  goog.dom.appendChild(columns, this.filterContainer);
  this.createFiltersDom(this.filterContainer);
};

/**
 * @return {Object.<boolean>}
 */
SearchView.prototype.getFilterValues = function(){
  return goog.structs.map(this.filterElements,function(value,key,collection){
    var filter = goog.dom.getChildren(value)[0];
    return filter.checked;
  });

}


/**
 * @param {!Element} container
 */
SearchView.prototype.createFiltersDom = function(container) {

  /** @type {!goog.structs.Map.<string, Array>} */
  var filterDetails = new goog.structs.Map();
  filterDetails.set("normal",['nd' , '1', 'Non-Distribution',true]);
  filterDetails.set("d1",['d[]', '1', 'Distribution 1', true]);
  filterDetails.set("d2",['d[]', '2', 'Distribution 2', true]);
  filterDetails.set("d3",['d[]', '3', 'Distribution 3', true]);
  filterDetails.set("conflicts",['filter_conflicts', '1', 'Hide conflicts']);
  filterDetails.set("full",['filter_full', '1', 'Hide full courses']);

  // var normal = DomUtils.createCheckbox('nd', '1', 'Non-Distribution', true);
  // var d1 = DomUtils.createCheckbox('d[]', '1', 'Distribution 1', true);
  // var d2 = DomUtils.createCheckbox('d[]', '2', 'Distribution 2', true);
  // var d3 = DomUtils.createCheckbox('d[]', '3', 'Distribution 3', true);
  // var conflicts = DomUtils.createCheckbox('filter_conflicts', '1', 'Hide conflicts');
  // var full = DomUtils.createCheckbox('filter_full', '1', 'Hide full courses');
  // credit hours
  // school
  // department
  // instructor

  /** @type{!Object.<!Element>} */
  this.filterElements = goog.structs.map(filterDetails,function(value,key,collections){
    var child = DomUtils.createCheckbox.apply(this,value); 
    goog.dom.appendChild(container,child);
    return child;
  },this);

  this.lastFilterValues = this.getFilterValues();
};


/**
 * @override
 */
SearchView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.hide(true);


  this.getHandler().
    listen(this.filterContainer, goog.events.EventType.CHANGE, this.onFilterChange).
    listen(this.cancelButton, goog.events.EventType.CLICK, this.onCloseSearch);

};


/**
 * @override
 */
SearchView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().
    unlisten(this.filterContainer, goog.events.EventType.CHANGE, this.onFilterChange).
    unlisten(this.cancelButton, goog.events.EventType.CLICK, this.onCloseSearch);
};


/**
 *
 */
SearchView.prototype.onCloseSearch = function() {
  this.hide();
}


/**
 *
 */
SearchView.prototype.onFilterChange = function() {
  this.lastFilterValues = this.getFilterValues();
  this.updateSearch();
}


SearchView.prototype.updateSearch = function() {
  var event = new SchedulePlannerEvent(SchedulePlannerEvent.Type.UPDATE_SEARCH);
  event.query = this.lastQuery;
  event.filters = this.lastFilterValues;
  this.dispatchEvent(event);
}



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
