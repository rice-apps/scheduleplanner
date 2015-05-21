goog.provide('org.riceapps.views.SchedulePlannerView');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('org.riceapps.views.CalendarView');
goog.require('org.riceapps.views.CourseListView');
goog.require('org.riceapps.views.CourseView');
goog.require('org.riceapps.views.FerpaInterruptView');
goog.require('org.riceapps.views.FooterView');
goog.require('org.riceapps.views.InterruptView');
goog.require('org.riceapps.views.ModalView');
goog.require('org.riceapps.views.NavigationBarView');
goog.require('org.riceapps.views.PlaygroundView');
goog.require('org.riceapps.views.SearchView');
goog.require('org.riceapps.views.ToolbarView');
goog.require('org.riceapps.views.TourView');
goog.require('org.riceapps.views.View');

goog.scope(function() {



/**
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.SchedulePlannerView = function() {
  goog.base(this);

  /** @private {!org.riceapps.views.NavigationBarView} */
  this.navigationBarView_ = new org.riceapps.views.NavigationBarView();
  this.addChild(this.navigationBarView_);

  /** @private {!org.riceapps.views.PlaygroundView} */
  this.playgroundView_ = new org.riceapps.views.PlaygroundView();
  this.addChild(this.playgroundView_);

  /** @private {!org.riceapps.views.CalendarView} */
  this.calendarView_ = new org.riceapps.views.CalendarView();
  this.addChild(this.calendarView_);

  /** @private {!org.riceapps.views.FooterView} */
  this.footerView_ = new org.riceapps.views.FooterView();
  this.addChild(this.footerView_);

  /** @private {!org.riceapps.views.SearchView} */
  this.searchView_ = new org.riceapps.views.SearchView();
  this.addChild(this.searchView_);

  /** @private {!org.riceapps.views.ToolbarView} */
  this.toolbarView_ = new org.riceapps.views.ToolbarView(this.searchView_);
  this.addChild(this.toolbarView_);
  this.searchView_.registerToolbarView(this.toolbarView_);

  /** @private {!org.riceapps.views.TourView} */
  this.tourView_ = new org.riceapps.views.TourView(this);
  this.addChild(this.tourView_);

  /** @private {!org.riceapps.views.CourseListView} */
  this.courseListView_ = new org.riceapps.views.CourseListView();
  this.addChild(this.courseListView_);

  /** @private {!org.riceapps.views.InterruptView} */
  this.loadingInterruptView_ = this.createLoadingInterruptView_();

  /** @private {!org.riceapps.views.InterruptView} */
  this.errorInterruptView_ = this.createErrorInterruptView_();

  /** @private {!org.riceapps.views.FerpaInterruptView} */
  this.ferpaInterruptView_ = new org.riceapps.views.FerpaInterruptView();
};
goog.inherits(org.riceapps.views.SchedulePlannerView,
              org.riceapps.views.View);
var SchedulePlannerView = org.riceapps.views.SchedulePlannerView;


/** @enum {string} */
SchedulePlannerView.Theme = {
  BASE: 'schedule-planner-view',
  COLUMNS: 'schedule-planner-view-columns',
  COLUMN: 'schedule-planner-view-column',
  LOADING_CONTAINER: 'schedule-planner-view-directions',
  LOADING_IMAGE: 'schedule-planner-view-loader',
  ERROR_CONTAINER: 'schedule-planner-view-error'
};


/**
 * @return {!org.riceapps.views.InterruptView}
 * @private
 */
SchedulePlannerView.prototype.createLoadingInterruptView_ = function() {
  var view = new org.riceapps.views.InterruptView();
  view.render();

  var element;
  var container = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(container, SchedulePlannerView.Theme.LOADING_CONTAINER);
  goog.dom.setTextContent(container, 'Welcome to Rice Schedule Planner (BETA)!');
  goog.dom.appendChild(view.getElement(), container);

  element = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(element, 'Please wait while we load your course and schedule data...');
  goog.dom.appendChild(container, element);

  goog.dom.classlist.add(view.getElement(), SchedulePlannerView.Theme.LOADING_IMAGE);

  return view;
};


/**
 * @return {!org.riceapps.views.InterruptView}
 */
SchedulePlannerView.prototype.getLoadingInterruptView = function() {
  return this.loadingInterruptView_;
};


/**
 * @return {!org.riceapps.views.TourView}
 */
SchedulePlannerView.prototype.getTourView = function() {
  return this.tourView_;
};


/**
 * @return {!org.riceapps.views.InterruptView}
 * @private
 */
SchedulePlannerView.prototype.createErrorInterruptView_ = function() {
  var view = new org.riceapps.views.InterruptView();
  view.render();

  var element;
  var container = goog.dom.createDom(goog.dom.TagName.DIV);
  goog.dom.classlist.add(container, SchedulePlannerView.Theme.LOADING_CONTAINER);
  goog.dom.setTextContent(container, 'Synchronization Failure');
  goog.dom.appendChild(view.getElement(), container);

  element = goog.dom.createDom(goog.dom.TagName.SPAN);
  goog.dom.setTextContent(element,
    'An unrecoverable error occured trying to synchronize your schedule with the remote server. ' +
    'Please reload the page in order to continue.');
  goog.dom.appendChild(container, element);

  goog.dom.classlist.add(view.getElement(), SchedulePlannerView.Theme.ERROR_CONTAINER);

  return view;
};


/**
 * @return {!org.riceapps.views.InterruptView}
 */
SchedulePlannerView.prototype.getErrorInterruptView = function() {
  return this.errorInterruptView_;
};


/**
 * @return {!org.riceapps.views.InterruptView}
 */
SchedulePlannerView.prototype.getFerpaInterruptView = function() {
  return this.ferpaInterruptView_;
};


/**
 * @return {!org.riceapps.views.CalendarView}
 */
SchedulePlannerView.prototype.getCalendarView = function() {
  return this.calendarView_;
};



/**
 * @return {!org.riceapps.views.ToolbarView}
 */
SchedulePlannerView.prototype.getToolbarView = function() {
  return this.toolbarView_;
};


/**
 * @return {!org.riceapps.views.SearchView}
 */
SchedulePlannerView.prototype.getSearchView = function() {
  return this.searchView_;
};


/**
 * @return {!org.riceapps.views.PlaygroundView}
 */
SchedulePlannerView.prototype.getPlaygroundView = function() {
  return this.playgroundView_;
};


/**
 * @return {!org.riceapps.views.CourseListView}
 */
SchedulePlannerView.prototype.getCourseListView = function() {
  return this.courseListView_;
};


/**
 * @return {!org.riceapps.views.TrashView}
 */
SchedulePlannerView.prototype.getTrashView = function() {
  return this.toolbarView_.getTrashView();
};


/**
 * @override
 */
SchedulePlannerView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), SchedulePlannerView.Theme.BASE);

  this.navigationBarView_.render(this.getElement());
  this.toolbarView_.render(this.getElement());

  var columns = goog.dom.createDom(goog.dom.TagName.DIV, SchedulePlannerView.Theme.COLUMNS);
  goog.dom.appendChild(this.getElement(), columns);

  var container = goog.dom.createDom(goog.dom.TagName.DIV, SchedulePlannerView.Theme.COLUMN);
  goog.dom.appendChild(columns, container);
  this.playgroundView_.render(container);
  this.calendarView_.render(columns);
  this.searchView_.render(this.calendarView_.getElement());
  this.courseListView_.render(this.getElement());
  this.footerView_.render(this.getElement());
  this.tourView_.render(this.getElement());
};



/**
 * @override
 */
SchedulePlannerView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.relayout(true);
};


/**
 * @override
 */
SchedulePlannerView.prototype.relayout = function(opt_preventAnimation) {
  var size = goog.dom.getViewportSize();
  goog.style.setWidth(this.getElementStrict(), Math.max(size.width, 1000));
  window.console.log('SchedulePlannerView.relayout');
  goog.base(this, 'relayout', opt_preventAnimation);
};

}); // goog.scope
