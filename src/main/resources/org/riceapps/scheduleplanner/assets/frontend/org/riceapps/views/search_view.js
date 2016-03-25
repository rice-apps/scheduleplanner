/**
 * A slide-in panel that displays search results and search filters.
 */

goog.provide('org.riceapps.views.SearchView');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.iter');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.Tooltip');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.events.ViewEvent');
goog.require('org.riceapps.fx.Animation');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.utils.DomUtils');
goog.require('org.riceapps.views.DraggableView');
goog.require('org.riceapps.views.ToolbarView');
goog.require('org.riceapps.views.View');


goog.scope(function() {
var Animation = org.riceapps.fx.Animation;
var DomUtils = org.riceapps.utils.DomUtils;
var DraggableView = org.riceapps.views.DraggableView;
var CourseModel = org.riceapps.models.CourseModel;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;
var ViewEvent = org.riceapps.events.ViewEvent;



/**
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.SearchView = function() {
  goog.base(this);

  /** @private {Element} */
  this.resultsContainer_ = null;

  /** @private {Element} */
  this.filterContainer_ = null;

  /** @private {string} */
  this.lastQuery_ = '';

  /** @private {?CourseModel.Filter} */
  this.lastFilterValues_ = null;

  /** @private {?org.riceapps.views.SearchView.FilterElements} */
  this.filterElements_ = null;

  /** @private {Element} */
  this.cancelButton_ = null;

  /** @private {boolean} */
  this.directionsShown_ = false;

  /** @private {Element} */
  this.directionsElement_ = null;

  /** @private {org.riceapps.views.ToolbarView} */
  this.toolbarView_ = null;

  /** @private {number} */
  this.scrollRestore_ = 0;

  /** @private {Element} */
  this.columns_ = null;

  /** @private {Element} */
  this.resultsColumn_ = null;

  /** @private {Element} */
  this.hider_ = null;

  /** @private {goog.ui.ComboBox} */
  this.instructorNameFilter_ = null;

  /** @private {goog.ui.ComboBox} */
  this.departmentFilter_ = null;

  /** @private {goog.ui.ComboBox} */
  this.schoolFilter_ = null;
};
goog.inherits(org.riceapps.views.SearchView,
              org.riceapps.views.View);
var SearchView = org.riceapps.views.SearchView;


/**
 * Represents the elements for the filters on this object.
 *
 * @typedef {{
 *   normal: !Element,
 *   d1: !Element,
 *   d2: !Element,
 *   d3: !Element,
 *   conflicts: !Element,
 *   full: !Element,
 *   indep: !Element
 * }}
 */
SearchView.FilterElements;


/**
 * @enum {string}
 */
SearchView.Theme = {
  BASE: 'search-view',
  DIRECTIONS: 'search-view-directions',
  COLUMNS: 'search-view-columns',
  RESULTS: 'search-view-results',
  FILTERS: 'search-view-filters',
  HIDER: 'search-view-hider',
  RESULTS_CONTAINER: 'search-view-results-container',
  TITLE: 'search-view-title',
  TOOLTIP: 'search-view-tooltip',
  SUBTITLE: 'search-view-subtitle'
};


/**
 * @param {!org.riceapps.views.ToolbarView} toolbarView
 */
SearchView.prototype.registerToolbarView = function(toolbarView) {
  this.toolbarView_ = toolbarView;
};


/**
 * @param {string} query
 */
SearchView.prototype.setQuery = function(query) {
  this.lastQuery_ = query;
  this.updateSearch();
};


/**
 * @override
 */
SearchView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), SearchView.Theme.BASE);

  var columns = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.COLUMNS);
  goog.dom.appendChild(this.getElement(), columns);
  this.columns_ = columns;

  var hider = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.HIDER);
  goog.dom.appendChild(columns, hider);
  this.hider_ = hider;

  var results = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.RESULTS);
  goog.dom.appendChild(columns, results);
  this.resultsColumn_ = results;

  var resultsContainer = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.RESULTS_CONTAINER);
  goog.dom.appendChild(results, resultsContainer);
  this.resultsContainer_ = resultsContainer;

  this.filterContainer_ = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.FILTERS);

  this.cancelButton_ = goog.dom.createDom(goog.dom.TagName.DIV, 'close-search-view');
  goog.dom.appendChild(this.filterContainer_, this.cancelButton_);

  goog.dom.appendChild(columns, this.filterContainer_);
  this.createFiltersDom(this.filterContainer_);

  // Directions
  var directionsSpan;
  this.directionsElement_ = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(this.directionsElement_, SearchView.Theme.DIRECTIONS);
  goog.dom.setTextContent(this.directionsElement_, 'No Results Found');
  goog.dom.appendChild(this.getElement(), this.directionsElement_);

  directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(directionsSpan,
    'There are no courses in our database that match your current search query and filters.');
  goog.dom.appendChild(this.directionsElement_, directionsSpan);

  directionsSpan = goog.dom.createDom(goog.dom.TagName.SPAN);
  directionsSpan.innerHTML =
    'If you can\'t find the course you\'re looking for, it may be because that course is only offered during certain semesters. ' +
    'Check the <a href="http://courses.rice.edu/" target="_blank">official course catalog</a> for more information.';
  goog.dom.appendChild(this.directionsElement_, directionsSpan);

  this.showDirections_();
};


/**
 * @return {CourseModel.Filter}
 */
SearchView.prototype.getFilterValues = function() {
  function getFilterValue(element) {
    return goog.dom.getChildren(element)[0].checked;
  }

  function getComboBoxValue(box) {
    if (box == null) {
      return null;
    }

    return box.getValue() || null;
  }

  return {
    normal: getFilterValue(this.filterElements_.normal),
    d1: getFilterValue(this.filterElements_.d1),
    d2: getFilterValue(this.filterElements_.d2),
    d3: getFilterValue(this.filterElements_.d3),
    indep: getFilterValue(this.filterElements_.indep),
    hideConflicts: getFilterValue(this.filterElements_.conflicts),
    hideFull: getFilterValue(this.filterElements_.full),
    instructor: getComboBoxValue(this.instructorNameFilter_),
    school: getComboBoxValue(this.schoolFilter_),
    department: getComboBoxValue(this.departmentFilter_),
    courseNumMin: null,
    courseNumMax: null,
    creditsMin: null,
    creditsMax: null
  };
};


/**
 * @param {!Element} container
 */
SearchView.prototype.createFiltersDom = function(container) {
  /** @type {!goog.structs.Map.<string, Array>} */
  var filterDetails = new goog.structs.Map();
  filterDetails.set('normal', ['nd' , '1', 'Non-Distribution', true]);
  filterDetails.set('d1', ['d[]', '1', 'Distribution 1', true]);
  filterDetails.set('d2', ['d[]', '2', 'Distribution 2', true]);
  filterDetails.set('d3', ['d[]', '3', 'Distribution 3', true]);
  filterDetails.set('indep', ['show_indep', '1', 'Independent Study', true]);
  filterDetails.set('conflicts', ['filter_conflicts', '1', 'Hide conflicts', false]);
  filterDetails.set('full', ['filter_full', '1', 'Hide full courses', false]);

  var header = goog.dom.createDom(goog.dom.TagName.DIV, SearchView.Theme.TITLE);
  goog.dom.setTextContent(header, 'Filter Results');
  goog.dom.appendChild(container, header);

  var subtitle = goog.dom.createDom(goog.dom.TagName.SPAN, SearchView.Theme.SUBTITLE);
  goog.dom.setTextContent(subtitle, 'Show:');
  goog.dom.appendChild(container, subtitle);

  function createCheckbox(name) {
    var value = filterDetails.get(name);
    var child = DomUtils.createCheckbox.apply(this, value);
    goog.dom.appendChild(container, child);
    return child;
  }

  this.filterElements_ = {
    normal: createCheckbox('normal'),
    d1: createCheckbox('d1'),
    d2: createCheckbox('d2'),
    d3: createCheckbox('d3'),
    indep: createCheckbox('indep')
  };


  subtitle = goog.dom.createDom(goog.dom.TagName.SPAN, SearchView.Theme.SUBTITLE);
  goog.dom.setTextContent(subtitle, 'Options:');
  goog.dom.appendChild(container, subtitle);

  this.filterElements_.conflicts = createCheckbox('conflicts');
  this.filterElements_.full = createCheckbox('full');

  var tooltip = new goog.ui.Tooltip(this.filterElements_.conflicts,
    'Hides courses that have time conflicts with any of the courses placed on your calendar.');

  this.lastFilterValues_ = this.getFilterValues();

  var caption;

  this.instructorNameFilter_ = new goog.ui.ComboBox();
  this.instructorNameFilter_.setUseDropdownArrow(true);
  this.instructorNameFilter_.setDefaultText('Select Instructor...');

  this.schoolFilter_ = new goog.ui.ComboBox();
  this.schoolFilter_.setUseDropdownArrow(true);
  this.schoolFilter_.setDefaultText('Select College/School...');

  this.departmentFilter_ = new goog.ui.ComboBox();
  this.departmentFilter_.setUseDropdownArrow(true);
  this.departmentFilter_.setDefaultText('Select Department...');

  this.registerDisposable(this.instructorNameFilter_);
  this.registerDisposable(this.schoolFilter_);
  this.registerDisposable(this.departmentFilter_);

  subtitle = goog.dom.createDom(goog.dom.TagName.SPAN, SearchView.Theme.SUBTITLE);
  goog.dom.setTextContent(subtitle, 'Filters:');
  goog.dom.appendChild(container, subtitle);
  this.instructorNameFilter_.render(container);
  this.schoolFilter_.render(container);
  this.departmentFilter_.render(container);

  // TODO(mschurr): Credit hours filter.
  // TODO(mschurr): Course number filter.
};


/**
 * @param  {!goog.structs.Set.<string>} instructors
 * @param  {!goog.structs.Set.<string>} schools
 * @param  {!goog.structs.Set.<string>} departments
 */
SearchView.prototype.initializeFilters = function(instructors, schools, departments) {
  window.console.log('SearchView.initializeFilters');

  var getSortedSet = function(set) {
    var items = [];

    goog.iter.forEach(set, function(value) {
      items.push(value);
    });

    goog.array.sort(items);
    return items;
  };

  goog.iter.forEach(getSortedSet(instructors), function(value) {
    this.instructorNameFilter_.addItem(new goog.ui.ComboBoxItem(value));
  }, this);

  goog.iter.forEach(getSortedSet(schools), function(value) {
    this.schoolFilter_.addItem(new goog.ui.ComboBoxItem(value));
  }, this);

  goog.iter.forEach(getSortedSet(departments), function(value) {
    this.departmentFilter_.addItem(new goog.ui.ComboBoxItem(value));
  }, this);
};


/**
 * @override
 */
SearchView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.hide(true);

  this.getHandler().
    listen(this.filterContainer_, goog.events.EventType.CHANGE, this.onFilterChange).
    listen(this.cancelButton_, goog.events.EventType.CLICK, this.onCloseSearchWithReset).
    listen(this.hider_, goog.events.EventType.CLICK, this.onCloseSearchWithReset).
    listen(this, DraggableView.EventType.DRAGSTART, this.onChildDragStart_).
    listen(this, DraggableView.EventType.DRAGEND, this.onChildDragEnd_).
    listen(this, [ViewEvent.Type.CHILD_ADDED, ViewEvent.Type.CHILD_REMOVED], this.handleChildrenChanged_).
    listen(this.instructorNameFilter_, goog.ui.Component.EventType.CHANGE, this.onFilterChange).
    listen(this.departmentFilter_, goog.ui.Component.EventType.CHANGE, this.onFilterChange).
    listen(this.schoolFilter_, goog.ui.Component.EventType.CHANGE, this.onFilterChange);
};


/**
 * @override
 */
SearchView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().removeAll();
};


/**
 * @param {!DraggableView.Event} event
 * @private
 */
SearchView.prototype.onChildDragStart_ = function(event) {
  this.hide();

  if (this.toolbarView_) {
    this.toolbarView_.getSearchInput().blur();
  }
};


/**
 * @param {!DraggableView.Event} event
 * @private
 */
SearchView.prototype.onChildDragEnd_ = function(event) {
  this.show();
};


/**
 *
 */
SearchView.prototype.onCloseSearchWithReset = function() {
  this.onCloseSearch(true);
};


/**
 * @param {boolean=} opt_reset
 */
SearchView.prototype.onCloseSearch = function(opt_reset) {
  this.hide();

  if (opt_reset && this.toolbarView_) {
    this.toolbarView_.resetInput();
  } else if (this.toolbarView_) {
    this.toolbarView_.blurInput();
  }
};


/**
 *
 */
SearchView.prototype.onFilterChange = function() {
  this.lastFilterValues_ = this.getFilterValues();
  this.updateSearch();
};


/**
 *
 */
SearchView.prototype.updateSearch = function() {
  var event = new SchedulePlannerEvent(SchedulePlannerEvent.Type.UPDATE_SEARCH);
  event.query = this.lastQuery_;
  event.filters = this.lastFilterValues_;
  this.dispatchEvent(event);
};


/**
 * @override
 */
SearchView.prototype.show = function(opt_preventAnimation) {
  if (this.isShown()) {
    return;
  }

  if (!this.hasChildren()) {
    this.updateSearch();
  }

  goog.base(this, 'show', opt_preventAnimation);
  goog.style.setElementShown(this.getElementStrict(), true);

  if (!opt_preventAnimation) {
    Animation.perform(this.getElementStrict(), Animation.Preset.FADE_IN_RIGHT_BIG).then(goog.bind(function(element) {
      // Due to a bug in Chrome, the browser fails to recognize the area is scrollable after it has been hidden and reshown.
      // The workaround for this appears to be changing the overflow property to force the browser to recognize scrollability.
      goog.style.setStyle(this.resultsContainer_, {'overflow': 'hidden'});
      goog.Timer.callOnce(function() {
        // NOTE: Asynchronous because property changes only take effect after returning control to the browser.
        // We need to let the overflow hidden take effect before toggling overflow back to auto.
        goog.style.setStyle(this.resultsContainer_, {'overflow': 'auto'});
        this.resultsContainer_.scrollTop = this.scrollRestore_;
      }, 0, this);
      return element;
    }, this));
  }

  this.relayout();
};


/**
 * @override
 */
SearchView.prototype.hide = function(opt_preventAnimation) {
  if (!this.isInDocument() || this.isHidden()) {
    return;
  }

  goog.base(this, 'hide', opt_preventAnimation);
  this.scrollRestore_ = this.resultsContainer_.scrollTop;

  if (!opt_preventAnimation) {
    Animation.perform(this.getElementStrict(), Animation.Preset.FADE_OUT_RIGHT_BIG).
        then(Animation.hideElement);
  } else {
    goog.style.setElementShown(this.getElementStrict(), false);
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

  this.resultsContainer_.scrollTop = 0;
  this.scrollRestore_ = 0;
};


/**
 * @override
 */
SearchView.prototype.getContentElement = function() {
  return this.resultsContainer_;
};


/**
 * @param {!org.riceapps.events.ViewEvent} event
 * @private
 */
SearchView.prototype.handleChildrenChanged_ = function(event) {
  if (this.hasChildren()) {
    this.hideDirections_();
  } else {
    this.showDirections_();
  }
};


/**
 * @return {void}
 * @private
 */
SearchView.prototype.showDirections_ = function() {
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
SearchView.prototype.hideDirections_ = function() {
  if (!this.directionsShown_) {
    return;
  }

  goog.style.setElementShown(this.directionsElement_, false);
  this.directionsShown_ = false;
};


/** @override */
SearchView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);
  window.console.log('SearchView.relayout');

  if (this.columns_ && this.resultsColumn_ && this.resultsContainer_) {
    var width = goog.style.getContentBoxSize(this.getElement()).width;
    goog.style.setStyle(this.columns_, {
      'width': width + 'px'
    });

    goog.style.setStyle(this.resultsColumn_, {
      'width': (width - 311) + 'px' // For hider and filters
    });

    goog.style.setStyle(this.resultsContainer_, {
      'width': (width - 311) + 'px' // For hider and filters
    });
  }
};


});  // goog.scope
