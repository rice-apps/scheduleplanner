goog.provide('org.riceapps.views.ToolbarView');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.EventType');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.views.CourseView');
goog.require('org.riceapps.views.SearchView');
goog.require('org.riceapps.views.TrashView');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



/**
 * TODO: Show the number of credits in calendar (all, D1, D2, D3)
 * TODO: Add an export option (for CRNs to Esther)
 * TODO: Add context menus to courses (quick delete, evaluations, information)
 *
 * @param {!org.riceapps.views.SearchView}
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.ToolbarView = function(searchView) {
  goog.base(this);

  /** @private {!org.riceapps.views.TrashView} */
  this.trashView_ = new org.riceapps.views.TrashView();
  this.addChild(this.trashView_);

  /** @private {Element} */
  this.searchInput_ = null;

  /** @private {Element} */
  this.statsContainer_ = null;

  /** @private {Element} */
  this.allCredits_ = null;

  /** @private {Element} */
  this.distributionOneCredits_ = null;

  /** @private {Element} */
  this.distrbutionTwoCredits_ = null;

  /** @private {Element} */
  this.distrbutionThreeCredits_ = null;

  /** @private {!org.riceapps.views.SearchView} */
  this.searchView_ = searchView;

  /** @private {string} */
  this.lastSearchQuery_ = '';

  /** @private {number} */
  this.updateSearchTimer_ = -1;
};
goog.inherits(org.riceapps.views.ToolbarView,
              org.riceapps.views.View);
var ToolbarView = org.riceapps.views.ToolbarView;


/** @enum {string} */
ToolbarView.Theme = {
  BASE: 'tool-bar-view',
  INPUT: 'tool-bar-view-input',
  STATS: 'tool-bar-view-stats',
  INPUT_ACTIVE: 'tool-bar-view-input-active'
};


/** @const {string} */
ToolbarView.DEFAULT_QUERY = 'Find Courses...';


/**
 * @return {!org.riceapps.views.TrashView}
 */
ToolbarView.prototype.getTrashView = function() {
  return this.trashView_;
};


/**
 * @override
 */
ToolbarView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), ToolbarView.Theme.BASE);
  this.trashView_.render(this.getElement());

  this.searchInput_ = goog.dom.createDom(goog.dom.TagName.INPUT, ToolbarView.Theme.INPUT);
  this.searchInput_.value = ToolbarView.DEFAULT_QUERY;
  goog.dom.appendChild(this.getElement(), this.searchInput_);

  this.statsContainer_ = goog.dom.createDom(goog.dom.TagName.DIV, ToolbarView.Theme.STATS);
  this.setCredits(0, 0, 0, 0);
  goog.dom.appendChild(this.getElement(), this.statsContainer_);
};


/**
 * @param {number} total
 * @param {number} d1
 * @param {number} d2
 * @param {number} d3
 */
ToolbarView.prototype.setCredits = function(total, d1, d2, d3) {
  // TODO(mschurr): Implement this and make the container look prettier.
  //goog.dom.setTextContent(this.statsContainer_, 'Credits: 0 (0 D1, 0 D2, 0 D3)');
};


/**
 * @override
 */
ToolbarView.prototype.relayout = function(opt_preventAnimation) {
  window.console.log('ToolbarView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};


/**
 * @override
 */
ToolbarView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().
    listen(this.searchInput_, goog.events.EventType.FOCUS, this.onSearchInputFocus_).
    listen(this.searchInput_, goog.events.EventType.BLUR, this.onSearchInputBlur_).
    listen(this.searchInput_, goog.events.EventType.KEYUP, this.onSearchInputKeyUp_);
};


/**
 * @override
 */
ToolbarView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().
    unlisten(this.searchInput_, goog.events.EventType.FOCUS, this.onSearchInputFocus_).
    unlisten(this.searchInput_, goog.events.EventType.BLUR, this.onSearchInputBlur_).
    unlisten(this.searchInput_, goog.events.EventType.KEYUP, this.onSearchInputKeyUp_);
};


/**
 * @param {?goog.events.BrowserEvent=} opt_event
 */
ToolbarView.prototype.onSearchInputBlur_ = function(opt_event) {
  if (this.searchInput_.value == '') {
    this.searchInput_.value = ToolbarView.DEFAULT_QUERY;
    goog.dom.classlist.remove(this.searchInput_, ToolbarView.Theme.INPUT_ACTIVE);
    this.searchView_.hide();
  }
};


/**
 * @param {?goog.events.BrowserEvent=} opt_event
 */
ToolbarView.prototype.onSearchInputFocus_ = function(opt_event) {
  if (this.searchInput_.value == ToolbarView.DEFAULT_QUERY) {
    this.searchInput_.value = '';
    goog.dom.classlist.add(this.searchInput_, ToolbarView.Theme.INPUT_ACTIVE);
    this.lastSearchQuery_ = '';
    this.onSearchQueryChanged_();
    this.searchView_.show();
  }
};


/**
 * @param {goog.events.KeyEvent} event
 */
ToolbarView.prototype.onSearchInputKeyUp_ = function(event) {
  if (event.keyCode == goog.events.KeyCodes.ESC) {
    this.searchInput_.blur();
  }

  // We want to trigger the search to update 400ms after the user finishes typing to save server-side resources.
  if (goog.events.KeyCodes.isTextModifyingKeyEvent(event) &&
      this.searchInput_.value != this.lastSearchQuery_ &&
      this.searchInput_.value.length > 2 &&
      this.searchInput_.value != ToolbarView.DEFAULT_QUERY) {
    this.lastSearchQuery_ = this.searchInput_.value;
    if (this.updateSearchTimer_ != -1) {
      goog.Timer.clear(this.updateSearchTimer_);
    }
    this.updateSearchTimer_ = goog.Timer.callOnce(this.onSearchQueryChanged_, 400, this);
  }
};


/**
 *
 */
ToolbarView.prototype.onSearchQueryChanged_ = function() {
  this.updateSearchTimer_ = -1;
  var event = new SchedulePlannerEvent(SchedulePlannerEvent.Type.UPDATE_SEARCH);
  event.query = this.lastSearchQuery_;
  this.dispatchEvent(event);
};


}); // goog.scope
