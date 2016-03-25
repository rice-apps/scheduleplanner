/**
 * A toolbar which is displayed above the calendar and contains the search text field and various buttons.
 */

goog.provide('org.riceapps.views.ToolbarView');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.models.UserModel');
goog.require('org.riceapps.views.CourseView');
goog.require('org.riceapps.views.DraggableView');
goog.require('org.riceapps.views.TrashView');
goog.require('org.riceapps.views.View');


goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;
var DraggableView = org.riceapps.views.DraggableView;
/**
 * TODO: Show the number of credits in calendar (all, D1, D2, D3)
 * TODO: Add an export option (for CRNs to Esther)
 * TODO: Add context menus to courses (quick delete, evaluations, information)
 *
 * @param {!org.riceapps.views.SearchView} searchView
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

  /** @private {number} */
  this.updateSearchTimer_ = -1;

  /** @private {string} */
  this.userName_ = '';

  /** @private {Element} */
  this.searchCloseButton_ = null;
};
goog.inherits(org.riceapps.views.ToolbarView,
              org.riceapps.views.View);
var ToolbarView = org.riceapps.views.ToolbarView;


/** @enum {string} */
ToolbarView.Theme = {
  BASE: 'tool-bar-view',
  INPUT: 'tool-bar-view-input',
  STATS: 'tool-bar-view-stats',
  TITLE: 'tool-bar-view-title',
  INPUT_ACTIVE: 'tool-bar-view-input-active',
  LOGOUT: 'tool-bar-view-logout',
  INPUT_CLOSE: 'tool-bar-input-close',
  INPUT_CLOSE_ACTIVE: 'tool-bar-input-close-active'
};


/** @const {string} */
ToolbarView.DEFAULT_QUERY = 'Find Courses...';


/** @const {number} */
ToolbarView.STOPPED_TYPING_DELAY = 400;


/**
 * @return {!org.riceapps.views.TrashView}
 */
ToolbarView.prototype.getTrashView = function() {
  return this.trashView_;
};

/**
 * @return {Element}
 */
ToolbarView.prototype.getSearchInput = function() {
  return this.searchInput_;
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

  var titleElement = goog.dom.createDom(goog.dom.TagName.DIV, ToolbarView.Theme.TITLE);
  goog.dom.setTextContent(titleElement, 'Rice Schedule Planner');
  goog.dom.appendChild(this.getElement(), titleElement);

  this.searchCloseButton_ = goog.dom.createDom(goog.dom.TagName.DIV, ToolbarView.Theme.INPUT_CLOSE);
  goog.dom.appendChild(this.getElement(), this.searchCloseButton_);

  var crnElement = goog.dom.createDom(goog.dom.TagName.DIV, 'crn-view');
  //goog.dom.appendChild(this.getElement(), crnElement); NOTE: No longer needed.
  this.crnElement_ = crnElement;
};


/**
 * @param {number} userId
 * @param {string} userName
 */
ToolbarView.prototype.setUserInfo = function(userId, userName) {
  this.userName_ = userName;


  var spanElement = goog.dom.createDom(goog.dom.TagName.SPAN, ToolbarView.Theme.LOGOUT);
  goog.dom.setTextContent(spanElement, 'Welcome, ' + this.userName_ + '. ');
  goog.dom.appendChild(this.getElement(), spanElement);

  var logoutElement = goog.dom.createDom(goog.dom.TagName.A);

  if (userId == org.riceapps.models.UserModel.INVALID_USER_ID) {
    logoutElement.href = '/login';
    goog.dom.setTextContent(logoutElement, '(Sign In)');
  } else {
    logoutElement.href = '/logout';
    goog.dom.setTextContent(logoutElement, '(Sign Out)');
  }

  goog.dom.appendChild(spanElement, logoutElement);
};


/**
 * @param {number} total
 * @param {number} d1
 * @param {number} d2
 * @param {number} d3
 */
ToolbarView.prototype.setCredits = function(total, d1, d2, d3) {
  window.console.log('ToolbarView.setCredits ', total, d1, d2, d3);
  // TODO(mschurr): Implement this and make the container look prettier.
  goog.dom.setTextContent(this.statsContainer_,
      'Credits: ' + total + ' (' + d1 + ' D1, ' + d2 + ' D2, ' + d3 + ' D3)');
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
    listen(this.searchInput_, goog.events.EventType.KEYUP, this.onSearchInputKeyUp_).
    listen(this.crnElement_, goog.events.EventType.CLICK, this.onCRNViewClick_).
    listen(this.searchCloseButton_, goog.events.EventType.CLICK, this.onSearchCloseClick_);
};


/**
 * @override
 */
ToolbarView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().removeAll();
};

/**
 * Event handler; called when crn button is clicked. Shows a modal view containing all current CRNs in schedule.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
ToolbarView.prototype.onCRNViewClick_ = function(event) {
  if (event != null) {
    var new_event = new SchedulePlannerEvent(SchedulePlannerEvent.Type.CRN_CLICK);
    this.dispatchEvent(new_event);
  }
};

/**
 * @param {?goog.events.BrowserEvent=} opt_event
 * @private
 */
ToolbarView.prototype.onSearchInputBlur_ = function(opt_event) {
  if (this.searchInput_.value == '') {
    this.searchInput_.value = ToolbarView.DEFAULT_QUERY;
    //goog.dom.classlist.remove(this.searchInput_, ToolbarView.Theme.INPUT_ACTIVE);
    //this.searchView_.hide();
  }
};


/**
 *
 */
ToolbarView.prototype.resetInput = function() {
  this.searchInput_.value = ToolbarView.DEFAULT_QUERY;
  goog.dom.classlist.remove(this.searchInput_, ToolbarView.Theme.INPUT_ACTIVE);
  goog.dom.classlist.remove(this.searchCloseButton_, ToolbarView.Theme.INPUT_CLOSE_ACTIVE);
  this.searchInput_.blur();
  this.onSearchQueryChanged_('');
};


/**
 *
 */
ToolbarView.prototype.blurInput = function() {
  goog.dom.classlist.remove(this.searchInput_, ToolbarView.Theme.INPUT_ACTIVE);
  goog.dom.classlist.remove(this.searchCloseButton_, ToolbarView.Theme.INPUT_CLOSE_ACTIVE);
  this.searchInput_.blur();
};


/**
 * @param {?goog.events.BrowserEvent=} opt_event
 * @private
 */
ToolbarView.prototype.onSearchInputFocus_ = function(opt_event) {
  if (this.searchInput_.value == ToolbarView.DEFAULT_QUERY) {
    this.searchInput_.value = '';
    this.onSearchQueryChanged_('');
  }

  goog.dom.classlist.add(this.searchInput_, ToolbarView.Theme.INPUT_ACTIVE);
  goog.dom.classlist.add(this.searchCloseButton_, ToolbarView.Theme.INPUT_CLOSE_ACTIVE);
  this.searchView_.show();
};


/**
 * @param {goog.events.KeyEvent} event
 * @private
 */
ToolbarView.prototype.onSearchCloseClick_ = function(event) {
  this.resetInput();
  this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.CLOSE_SEARCH_VIEW));
};


/**
 * @param {goog.events.KeyEvent} event
 * @private
 */
ToolbarView.prototype.onSearchInputKeyUp_ = function(event) {
  if (event.keyCode == goog.events.KeyCodes.ESC) {
    this.resetInput();
    this.searchView_.hide();
  }

  if (goog.events.KeyCodes.isTextModifyingKeyEvent(event) &&
      /*this.searchInput_.value.length > 2 &&*/
      this.searchInput_.value != ToolbarView.DEFAULT_QUERY) {

    // NOTE: Do not trigger a search on every keypress as searching is expensive; trigger a search only after the
    // user has stopped typing for 400ms.
    if (this.updateSearchTimer_ != -1) {
      goog.Timer.clear(this.updateSearchTimer_);
      this.updateSearchTimer_ = -1;
    }

    this.updateSearchTimer_ = goog.Timer.callOnce(this.userDidStopTyping_, ToolbarView.STOPPED_TYPING_DELAY, this);
  }
};


/**
 * @private
 */
ToolbarView.prototype.userDidStopTyping_ = function() {
  this.onSearchQueryChanged_(this.searchInput_.value);
};


/**
 * @param {string} query
 * @private
 */
ToolbarView.prototype.onSearchQueryChanged_ = function(query) {
  if (this.updateSearchTimer_ != -1) {
    goog.Timer.clear(this.updateSearchTimer_);
    this.updateSearchTimer_ = -1;
  }

  this.searchView_.setQuery(query);
};

}); // goog.scope
