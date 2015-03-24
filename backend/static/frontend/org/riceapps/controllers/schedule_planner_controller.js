goog.provide('org.riceapps.controllers.SchedulePlannerController');

goog.require('goog.Promise');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('org.riceapps.controllers.Controller');
goog.require('org.riceapps.controllers.SchedulePlannerXhrController');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.events.SchedulePlannerXhrEvent');
goog.require('org.riceapps.events.UserModelEvent');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.models.CoursesModel');
goog.require('org.riceapps.models.UserModel');
goog.require('org.riceapps.views.CourseView');
goog.require('org.riceapps.views.CourseCalendarView');
goog.require('org.riceapps.views.CourseCalendarGuideView');
goog.require('org.riceapps.views.CourseSearchView');
goog.require('org.riceapps.views.DraggableView');
goog.require('org.riceapps.views.CourseModalView');
goog.require('org.riceapps.views.CRNModalView');
goog.require('org.riceapps.views.SchedulePlannerView');
goog.require('org.riceapps.views.PlaygroundView');


goog.scope(function() {
var CourseModel = org.riceapps.models.CourseModel;
var CourseView = org.riceapps.views.CourseView;
var DraggableView = org.riceapps.views.DraggableView;
var ModalView = org.riceapps.views.ModalView;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;
var SchedulePlannerXhrEvent = org.riceapps.events.SchedulePlannerXhrEvent;
var SchedulePlannerXhrController = org.riceapps.controllers.SchedulePlannerXhrController;
var UserModelEvent = org.riceapps.events.UserModelEvent;


/**
 * @extends {org.riceapps.controllers.Controller}
 * @constructor
 */
org.riceapps.controllers.SchedulePlannerController = function() {
  goog.base(this);

  /** @private {!org.riceapps.views.SchedulePlannerView} */
  this.view_ = new org.riceapps.views.SchedulePlannerView();
  
  /** @private {!org.riceapps.controllers.SchedulePlannerXhrController} */
  this.xhrController_ = new org.riceapps.controllers.SchedulePlannerXhrController();

  /** @private {org.riceapps.models.UserModel} */
  this.userModel_ = null;

  /** @private {org.riceapps.models.CoursesModel} */
  this.coursesModel_ = null;

  /** @private {number} */
  this.calendarInsertAt_ = 0;
};
goog.inherits(org.riceapps.controllers.SchedulePlannerController,
              org.riceapps.controllers.Controller);
var SchedulePlannerController = org.riceapps.controllers.SchedulePlannerController;


/**
 * Event handler; called when a course view is clicked. Shows a modal view containing information about the course.
 * @param {goog.events.BrowserEvent} event
 * @private
 */
SchedulePlannerController.prototype.onCourseViewClick_ = function(event) {
  var courseView = /** @type {org.riceapps.views.AbstractCourseView|Node} */ (event.target);
  var modalView = new org.riceapps.views.CourseModalView(courseView.getCourseModel());
  modalView.disposeOnHide().show();
};

/**
 * Event handler; called when crn button is clicked. Shows a modal view containing all current CRNs in schedule.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.onCRNViewClick_ = function(event) {
  if (this.userModel_ != null && event.type == "sp_crn_click"){
    var modalView = new org.riceapps.views.CRNModalView(this.userModel_);
    modalView.disposeOnHide().show();
  }
};

/**
 * Event handler; called when clear playground button is clicked. Clears all courses from the playground.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.onClearPlaygroundClick_ = function(event) {
  if (this.userModel_ != null && event.type == SchedulePlannerEvent.Type.CLEAR_PLAYGROUND_CLICK){
    var playground_view = this.view_.getPlaygroundView();
    var course_count = playground_view.getChildCount();
    for (var i = 0; i < course_count; i++) {
      var first_child = playground_view.getChildAt(0);
      // Update the user model.
      this.userModel_.removeCoursesFromPlayground([first_child.getCourseModel()]);

      // Dispose of the view.
      this.view_.getPlaygroundView().removeChild(first_child, true);
      first_child.dispose();
    }
  }
};

/**
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleAddGuideViews_ = function(event) {
  var views = event.target.getGuideViews();
  for(var i = 0; i < views.length; i++) {
    this.view_.getCalendarView().addChildAt(views[i], views[i].getChildIndex(), true);
  }
};


/**
 * @param {DraggableView.Event} event
 * @private
 */
SchedulePlannerController.prototype.onCourseViewDropped_ = function(event) {
  // Move an item from the calendar to the calendar.
  if(event.dropTarget instanceof org.riceapps.views.CourseCalendarGuideView &&
     event.target instanceof org.riceapps.views.CourseCalendarView) {
    window.console.log("[MoveEvent] CALENDAR [" + event.target.getCourseModel().getId() + "] -> CALENDAR [" + event.dropTarget.getCourseModel().getId() + "]");

    // Update the user model.
    this.calendarInsertAt_ = event.target.getParent().indexOfChild(event.target);

    if (event.target.getCourseModel().getId() != event.dropTarget.getCourseModel().getId()) {
      //this.userModel_.removeCoursesFromSchedule([event.target.getCourseModel()]);
      //this.userModel_.addCoursesToSchedule([event.dropTarget.getCourseModel()]);
      this.userModel_.updateSchedule(
          [event.target.getCourseModel()],
          [event.dropTarget.getCourseModel()]);

      // Dispose of the view.
      event.target.getParent().removeChild(event.target, true);
      event.target.dispose();
    }
  }

  // Move an item from the search view to the calendar.
  else if(event.dropTarget instanceof org.riceapps.views.CourseCalendarGuideView &&
          event.target instanceof org.riceapps.views.CourseSearchView) {
    window.console.log("[MoveEvent] SEARCH -> CALENDAR [" + event.dropTarget.getCourseModel().getId() + "]");

    // Update the user model.
    this.userModel_.addCoursesToSchedule([event.dropTarget.getCourseModel()]);

    // Dispose of the view.
    event.target.getParent().removeChild(event.target, true);
    event.target.dispose();
  }

  // Move an item from the playground to the calendar.
  else if(event.dropTarget instanceof org.riceapps.views.CourseCalendarGuideView &&
          event.target instanceof org.riceapps.views.CourseView) {
    window.console.log("[MoveEvent] PLAYGROUND [" + event.target.getCourseModel().getId() + "] -> CALENDAR [" + event.dropTarget.getCourseModel().getId() + "]");

    // Update the user model.
    //this.userModel_.removeCoursesFromPlayground([event.target.getCourseModel()]);
    //this.userModel_.addCoursesToSchedule([event.dropTarget.getCourseModel()]);
    this.userModel_.moveCoursesFromPlaygroundToSchedule(
        [event.target.getCourseModel()],
        [event.dropTarget.getCourseModel()]);

    // Dispose of the view.
    event.target.getParent().removeChild(event.target, true);
    event.target.dispose();
  }

  // Move an item from the calendar to the playground.
  else if(event.dropTarget === this.view_.getPlaygroundView() &&
          event.target instanceof org.riceapps.views.CourseCalendarView) {
    window.console.log("[MoveEvent] CALENDAR -> PLAYGROUND [" + event.target.getCourseModel().getId() + "]");

    // Update the user model.
    //this.userModel_.removeCoursesFromSchedule([event.target.getCourseModel()]);
    //this.userModel_.addCoursesToPlayground([event.target.getCourseModel()]);
    this.userModel_.moveCoursesFromScheduleToPlayground(
        [event.target.getCourseModel()],
        [event.target.getCourseModel()]);

    // Dispose of the view.
    event.target.getParent().removeChild(event.target, true);
    event.target.dispose();
  }

  // Move an item from the search results to the playground.
  else if(event.dropTarget === this.view_.getPlaygroundView() &&
          event.target instanceof org.riceapps.views.CourseSearchView) {
    window.console.log("[MoveEvent] SEARCH -> PLAYGROUND [" + event.target.getCourseModel().getId() + "]");

    // Update the user model.
    this.userModel_.addCoursesToPlayground([event.target.getCourseModel()]);

    // Dispose of the view.
    event.target.getParent().removeChild(event.target, true);
    event.target.dispose();
  }

  // Move an item from the playground to the playground.
  else if(event.dropTarget === this.view_.getPlaygroundView() &&
          event.target instanceof org.riceapps.views.CourseView) {
    // DO NOTHING.
  }

  // Move an item from the calendar to the trash.
  else if(event.dropTarget === this.view_.getTrashView() &&
          event.target instanceof org.riceapps.views.CourseCalendarView) {
    window.console.log("[MoveEvent] CALENDAR -> TRASH [" + event.target.getCourseModel().getId() + "]");

    // Update the user model.
    this.userModel_.removeCoursesFromSchedule([event.target.getCourseModel()]);

    // Dispose of the view.
    event.target.getParent().removeChild(event.target, true);
    event.target.dispose();
  }

  // Move an item from the playground to the trash.
  else if(event.dropTarget === this.view_.getTrashView() &&
          event.target instanceof org.riceapps.views.CourseView) {
    window.console.log("[MoveEvent] PLAYGROUND -> TRASH [" + event.target.getCourseModel().getId() + "]");

    // Update the user model.
    this.userModel_.removeCoursesFromPlayground([event.target.getCourseModel()]);

    // Dispose of the view.
    event.target.getParent().removeChild(event.target, true);
    event.target.dispose();
  }

  this.view_.getCalendarView().relayout();
};


/**
 * @param {UserModelEvent} event
 * @private
 */
SchedulePlannerController.prototype.handlePlaygroundCoursesAdded_ = function(event) {
  this.addCoursesToPlayground(event.courses);
};


/**
 * @param {UserModelEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleScheduleCoursesAdded_ = function(event) {
  this.addCoursesToSchedule(event.courses);
};


/**
 * @param {!org.riceapps.models.CoursesModel} coursesModel
 * @private
 */
SchedulePlannerController.prototype.onCoursesReady_ = function(coursesModel) {
  window.console.log('SchedulePlannerController.onCoursesReady_', coursesModel);
  this.coursesModel_ = coursesModel;
  this.onUserModelAndCoursesReady_();
};


/**
 * @private
 */
SchedulePlannerController.prototype.onUserModelAndCoursesReady_ = function() {
  if (!(this.userModel_ && this.coursesModel_)) {
    return;
  }

  window.console.log('SchedulePlannerController.onUserModelAndCoursesReady_');

  this.userModel_.initialize(this.coursesModel_);
  this.addCoursesToPlayground(this.userModel_.getCoursesInPlayground());
  this.addCoursesToSchedule(this.userModel_.getCoursesInSchedule());

  // TODO(mschurr@rice.edu): May also wish to listen for remove events to keep model and UI synchronized... however,
  // since delete should only be triggered by the UI, no need to do this for now.
  this.getHandler().
    listen(this.userModel_, UserModelEvent.Type.PLAYGROUND_COURSES_ADDED, this.handlePlaygroundCoursesAdded_).
    listen(this.userModel_, UserModelEvent.Type.SCHEDULE_COURSES_ADDED, this.handleScheduleCoursesAdded_).
    listen(this.view_, SchedulePlannerEvent.Type.UPDATE_SEARCH, this.handleUpdateSearch_).
	  listen(this.view_, SchedulePlannerEvent.Type.CRN_CLICK, this.onCRNViewClick_).
    listen(this.userModel_, UserModelEvent.Type.USER_MODEL_CHANGED, this.handleUserModelChange_).
    listen(this.view_, SchedulePlannerEvent.Type.CLEAR_PLAYGROUND_CLICK, this.onClearPlaygroundClick_);
	
  this.handleUserModelChange_();
  this.view_.getToolbarView().setUserName(this.userModel_.getUserName());
  this.view_.getLoadingInterruptView().hide();
}


/**
 * @param {org.riceapps.events.UserModelEvent=} opt_event
 */
SchedulePlannerController.prototype.handleUserModelChange_ = function(opt_event) {
  this.view_.getToolbarView().setCredits(
    this.userModel_.getCreditHoursInSchedule(),
    this.userModel_.getCreditHoursInSchedule(1),
    this.userModel_.getCreditHoursInSchedule(2),
    this.userModel_.getCreditHoursInSchedule(3));
};


/**
 * @param {!org.riceapps.models.UserModel} userModel
 * @private
 */
SchedulePlannerController.prototype.onUserModelReady_ = function(userModel) {
  window.console.log('SchedulePlannerController.onUserModelReady_', userModel);
  this.userModel_ = userModel;
  this.onUserModelAndCoursesReady_();
};


/**
 * @param {!SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleUpdateSearch_ = function(event) {
  if (!this.coursesModel_) {
    return;
  }

  this.view_.getSearchView().setLoading(true);

  if (event.filters === null)
    throw new Error("A query needs a filter");

  var results = this.coursesModel_.getCoursesByQuery(event.query, event.filters, this.userModel_);
  var views = [];

  for (var i = 0; i < results.length; i++) {
    var view = new org.riceapps.views.CourseSearchView(results[i]);
    view.addDropTarget(this.view_.getPlaygroundView());
    views.push(view);
  }

  this.view_.getSearchView().setSearchResults(views);
  this.view_.getSearchView().setLoading(false);
};


/**
 * @private
 */
SchedulePlannerController.prototype.onXhrError_ = function(errorType) {
  // TODO(mschurr@rice.edu): Error handling.
  window.console.log('[ERROR] [CRITICAL] Failed to fetch user model.');

  /*if (errorType == SchedulePlannerXhrController.ErrorType.SESSION_EXPIRED) {
    // TODO(mschurr): Block all access to the UI, display message to the user informing them to refresh the page.
  }*/
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.addCoursesToPlayground = function(courses) {
  for (var i = 0; i < courses.length; i++) {
    var course = new org.riceapps.views.CourseView(courses[i]);
    this.view_.getPlaygroundView().addChild(course, true);
    course.addDropTarget(this.view_.getPlaygroundView());
    course.addDropTarget(this.view_.getTrashView());
  }
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 * @param {number=} opt_index
 */
SchedulePlannerController.prototype.addCoursesToSchedule = function(courses, opt_index) {
  var index = opt_index || this.calendarInsertAt_ || 0;
  index = Math.max(index, 0);
  index = Math.min(index, this.view_.getCalendarView().getChildCount() + 1);

  for (var i = 0; i < courses.length; i++) {
    var course = new org.riceapps.views.CourseCalendarView(courses[i]);
    this.view_.getCalendarView().addChildAt(course, index, true);
    course.addDropTarget(this.view_.getPlaygroundView());
    course.addDropTarget(this.view_.getTrashView());
  }

  this.calendarInsertAt_ = 0;
};


/**
 * @param {goog.events.Event} event
 */
SchedulePlannerController.prototype.onCourseViewDragEnd_ = function(event) {
  // Force the calendar view to re-draw items located on the calendar since the guide views will have disappeared.
  this.view_.getCalendarView().relayout();
};

/**
 * @param {goog.events.Event} event
 */
SchedulePlannerController.prototype.onCourseViewDragStart_ = function(event) {
  if (event.target.getParent() === this.view_.getPlaygroundView()) {
    this.view_.getSearchView().onCloseSearch();
  }
};


/**
 * Informs the controller to start rendering and listening for events.
 */
SchedulePlannerController.prototype.start = function() {
  this.view_.render();
  this.view_.getLoadingInterruptView().show();
  
  this.getHandler().
    listen(this.view_, DraggableView.EventType.CLICK, this.onCourseViewClick_).
    listen(this.view_, DraggableView.EventType.DROPPED, this.onCourseViewDropped_).
	  listen(this.view_, DraggableView.EventType.CLICK, this.onCRNViewClick_).
    listen(this.view_, goog.events.EventType.CLICK, this.onClearPlaygroundClick_).
    listen(this.view_, DraggableView.EventType.DRAGEND, this.onCourseViewDragEnd_).
    listen(this.view_, DraggableView.EventType.DRAGSTART, this.onCourseViewDragStart_).
    listen(this.view_, SchedulePlannerEvent.Type.ADD_GUIDE_VIEWS, this.handleAddGuideViews_).
    listen(this.xhrController_, SchedulePlannerXhrEvent.Type.XHR_FAILED, this.handleXhrFailed_);
  this.xhrController_.getUserModel().then(this.onUserModelReady_, this.onXhrError_, this);
  this.xhrController_.getAllCourses().then(this.onCoursesReady_, this.onXhrError_, this);
};


/**
 * @param {!SchedulePlannerXhrEvent} event
 */
SchedulePlannerController.prototype.handleXhrFailed_ = function(event) {
  window.console.log('[XhrEvent] SchedulePlannerController.handleXhrFailed_', event);
  this.view_.getLoadingInterruptView().hide();
  this.view_.getErrorInterruptView().show();
};


});  // goog.scope