goog.provide('org.riceapps.controllers.SchedulePlannerController');

goog.require('goog.Promise');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Event');
goog.require('org.riceapps.SchedulePlannerConfig');
goog.require('org.riceapps.controllers.Controller');
goog.require('org.riceapps.controllers.SchedulePlannerXhrController');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.events.SchedulePlannerXhrEvent');
goog.require('org.riceapps.events.UserModelEvent');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.models.CoursesModel');
goog.require('org.riceapps.models.UserModel');
goog.require('org.riceapps.views.AbstractCourseView');
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
var SchedulePlannerConfig = org.riceapps.SchedulePlannerConfig;
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
  this.view_.addChild(modalView);
  modalView.disposeOnHide().show();
};


/**
 * Event handler; called when a course view is clicked. Shows a modal view containing information about the course.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleShowCourseDetails_ = function(event) {
  if (!event.model) {
    return;
  }

  var modalView = new org.riceapps.views.CourseModalView(event.model);
  this.view_.addChild(modalView);
  modalView.disposeOnHide().show();
};


/**
 * Event handler; called when a course view is clicked. Shows a modal view containing information about the course.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleShowCourseEvals_ = function(event) {
  this.openCourseEvaluations(event.model);
};


/**
 * Opens the course evaluations in a new browser tab.
 *
 * We perform an XSRF attack on ESTHER to send the user to the course evaluations page. This attack will require the
 * user to be logged into ESTHER. A note about this requirement should be placed next to the link.
 *
 * NOTE: In this case, the XSRF attack is pretty non-damaging since it simply retrieves the evaluations, but ESTHER
 * should probably fix this.
 *
 * To retreive course evaluations:
 * POST https://esther.rice.edu/selfserve/swkscmt.main HTTP/1.1
 * p_commentid:
 * p_confirm: 1
 * p_term: <year><term_code>
 * p_type: Course
 * p_crn: <crn>
 *
 * To retrieve instructor evaluations:
 * POST https://esther.rice.edu/selfserve/swkscmt.main HTTP/1.1
 * p_commentid:
 * p_confirm: 1
 * p_term: <year><term_code>
 * p_type: Instructor
 * p_instr: <instructor_id>
 *
 * NOTE: The ESTHER instructor IDs are different than our internal ones and unfortunately there is no way to data mine
 * them since the course feed does not include them; we will need to get the list from the university for this purpose,
 * or drop the feature. The user can easily find the instructor evaluations from within ESTHER.
 */
SchedulePlannerController.prototype.openCourseEvaluations = function(courseModel) {
  var form = goog.dom.createDom(goog.dom.TagName.FORM, {
    'target': '_blank',
    'action': 'https://esther.rice.edu/selfserve/swkscmt.main',
    'method': 'POST'
  });

  var params = {
    'p_commentid': '',
    'p_confirm': '1',
    'p_term': courseModel.getFormattedTermCodeForPrevYear(),
    'p_type': 'Course',
    'p_crn': courseModel.getCrn()
  };

  for (var key in params) {
    var input = goog.dom.createDom(goog.dom.TagName.INPUT, {
      'type': 'hidden',
      'name': key,
      'value': params[key]
    });
    goog.dom.appendChild(form, input);
  }

  goog.dom.appendChild(document.body, form);
  form.submit();
  goog.dom.removeNode(form);
};


/**
 * Event handler; called when crn button is clicked. Shows a modal view containing all current CRNs in schedule.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.onCRNViewClick_ = function(event) {
  if (this.userModel_ != null) {
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
  if (this.userModel_ != null) {
    var playground_view = this.view_.getPlaygroundView();
    var course_count = playground_view.getChildCount();
    var courses = [];

    for (var i = 0; i < course_count; i++) {
      var child = playground_view.getChildAt(i);
      courses.push(child.getCourseModel());
    }

    this.userModel_.removeCoursesFromPlayground(courses);
    playground_view.removeChildren(true);
  }
};


/**
 * Event handler; called when a AbstractCourseView is being dragged to add guide views to the calendar.
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
 * Adds the given courses to playground as views.
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
 * Event handler; called when a course should be removed from the UI.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleRemoveCourse_ = function(event) {
  window.console.log('SchedulePlannerController.handleRemoveCourse_', event.model);
  var course = event.model;
  var views;

  // Figure out if the view is in the playground and remove it.
  views = this.view_.getPlaygroundView().removeChildrenIf(function(child) {
    return child instanceof org.riceapps.views.AbstractCourseView && child.getCourseModel().equals(course);
  });

  if (views.length > 0) {
    this.userModel_.removeCoursesFromPlayground([course]);
  }

  for (var i = 0; i < views.length; i++) {
    views[i].dispose();
  }

  // Figure out if the view is in the calendar and ermove it.
  views = this.view_.getCalendarView().removeChildrenIf(function(child) {
    return child instanceof org.riceapps.views.AbstractCourseView && child.getCourseModel().equals(course);
  });

  if (views.length > 0) {
    this.userModel_.removeCoursesFromSchedule([course]);
  }

  for (var i = 0; i < views.length; i++) {
    views[i].dispose();
  }

  this.view_.getCalendarView().relayout();
};


/**
 * Event handler; called when a course should be moved to the playground.
 * NOTE: Course may be present in calendar or not at all.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleMoveToPlayground_ = function(event) {
  window.console.log('SchedulePlannerController.handleMoveToPlayground_', event.model);
  var course = event.model;
  var views;

  // Figure out if the view is in the search view.
  views = this.view_.getSearchView().removeChildrenIf(function(child) {
    return child instanceof org.riceapps.views.AbstractCourseView && child.getCourseModel().equals(course);
  });

  if (views.length > 0) {
    this.userModel_.addCoursesToPlayground([course]);
  }

  for (var i = 0; i < views.length; i++) {
    views[i].dispose();
  }

  // Figure out if the view is in the calendar and remove it.
  views = this.view_.getCalendarView().removeChildrenIf(function(child) {
    return child instanceof org.riceapps.views.AbstractCourseView && child.getCourseModel().equals(course);
  });

  if (views.length > 0) {
    this.userModel_.moveCoursesFromScheduleToPlayground([course], [course]);
  }

  for (var i = 0; i < views.length; i++) {
    views[i].dispose();
  }

  this.view_.getCalendarView().relayout();
};


/**
 * Event handler; called when a course should be moved to the calendar.
 * NOTE: Course may be present in search/playground or not at all.
 * @param {SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleMoveToCalendar_ = function(event) {
  window.console.log('SchedulePlannerController.handleMoveToPlayground_', event.model);
  var course = event.model;
  var views;

  // Figure out if the view is in the search view.
  views = this.view_.getSearchView().removeChildrenIf(function(child) {
    return child instanceof org.riceapps.views.AbstractCourseView && child.getCourseModel().equals(course);
  });

  if (views.length > 0) {
    this.userModel_.addCoursesToSchedule([course]);
  }

  for (var i = 0; i < views.length; i++) {
    views[i].dispose();
  }

  // Figure out if the view is in the calendar and remove it.
  views = this.view_.getPlaygroundView().removeChildrenIf(function(child) {
    return child instanceof org.riceapps.views.AbstractCourseView && child.getCourseModel().equals(course);
  });

  if (views.length > 0) {
    this.userModel_.moveCoursesFromPlaygroundToSchedule([course], [course]);
  }

  for (var i = 0; i < views.length; i++) {
    views[i].dispose();
  }

  this.view_.getCalendarView().relayout();
};


/**
 * Adds given coruses to schedule as views.
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
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.moveCoursesFromPlaygroundToCalendar = function(courses) {
  // TODO(mschurr): Implement.
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.moveCoursesFromCalendarToPlayground = function(courses) {
  // TODO(mschurr): Implement.
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.moveCoursesFromCalendarToCalendar = function(courses) {
  // TODO(mschurr): Implement.
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.moveCoursesFromSearchToCalendar = function(courses) {
  // TODO(mschurr): Implement.
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.moveCoursesFromSearchToPlayground = function(courses) {
  // TODO(mschurr): Implement.
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.removeCoursesFromCalendar = function(courses) {
  // TODO(mschurr): Implement.
};


/**
 * @param {!Array.<!org.riceapps.models.CourseModel>} courses
 */
SchedulePlannerController.prototype.removeCoursesFromPlayground = function(courses) {
  // TODO(mschurr): Implement.
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
 * Event handler; called when courses are added to the user model playground.
 * @param {UserModelEvent} event
 * @private
 */
SchedulePlannerController.prototype.handlePlaygroundCoursesAdded_ = function(event) {
  this.addCoursesToPlayground(event.courses);
};


/**
 * Event handler; called when courses are added to the user model schedule.
 * @param {UserModelEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleScheduleCoursesAdded_ = function(event) {
  this.addCoursesToSchedule(event.courses);
};


/**
 * Event handler; called when courses database is fully loaded from backend.
 * @param {!org.riceapps.models.CoursesModel} coursesModel
 * @private
 */
SchedulePlannerController.prototype.onCoursesReady_ = function(coursesModel) {
  window.console.log('SchedulePlannerController.onCoursesReady_', coursesModel);
  this.coursesModel_ = coursesModel;
  this.onUserModelAndCoursesReady_();
};


/**
 * Event handler; called when both courses database and user model are fully loaded from backend.
 * @private
 */
SchedulePlannerController.prototype.onUserModelAndCoursesReady_ = function() {
  if (!(this.userModel_ && this.coursesModel_)) {
    return; // Only proceed if both are ready.
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
    listen(this.view_.getFerpaInterruptView(), SchedulePlannerEvent.Type.AGREE_DISCLAIMER, this.onDisclaimerAgreed_).
    listen(this.view_, SchedulePlannerEvent.Type.EXIT_TOUR, this.onTourSeen_).
    listen(this.userModel_, UserModelEvent.Type.USER_MODEL_CHANGED, this.handleUserModelChange_).
    listen(this.view_, SchedulePlannerEvent.Type.CLEAR_PLAYGROUND_CLICK, this.onClearPlaygroundClick_).
    listen(this.view_, SchedulePlannerEvent.Type.SHOW_COURSE_EVALS, this.handleShowCourseEvals_).
    listen(this.view_, SchedulePlannerEvent.Type.REMOVE_COURSE, this.handleRemoveCourse_).
    listen(this.view_, SchedulePlannerEvent.Type.MOVE_TO_PLAYGROUND, this.handleMoveToPlayground_).
    listen(this.view_, SchedulePlannerEvent.Type.MOVE_TO_CALENDAR, this.handleMoveToCalendar_).
    listen(this.view_, SchedulePlannerEvent.Type.SHOW_COURSE_DETAILS, this.handleShowCourseDetails_);

  this.handleUserModelChange_();
  this.view_.getToolbarView().setUserName(this.userModel_.getUserName());

  // Remove the loading view.
  this.view_.getLoadingInterruptView().hide();

  // Proceed: Disclaimer > Tour > Main UI
  if (!this.userModel_.hasAgreedToDisclaimer()) {
    this.view_.getFerpaInterruptView().show();
  } else if (!this.userModel_.hasSeenTour() && SchedulePlannerConfig.ENABLE_TOURS) {
    this.view_.getTourView().show();
  }
}


/**
 * Event handler; called when the user model changes.
 * @param {org.riceapps.events.UserModelEvent=} opt_event
 */
SchedulePlannerController.prototype.handleUserModelChange_ = function(opt_event) {
  // Update credit counter in toolbar.
  this.view_.getToolbarView().setCredits(
    this.userModel_.getCreditHoursInSchedule(),
    this.userModel_.getCreditHoursInSchedule(1),
    this.userModel_.getCreditHoursInSchedule(2),
    this.userModel_.getCreditHoursInSchedule(3));

  // Update the list view.
  this.view_.getCourseListView().setCourses(this.userModel_.getCoursesInSchedule());
};


/**
 * Event Handler; called when user agrees to disclaimer.
 * @param {SchedulePlannerEvent=} opt_event
 */
SchedulePlannerController.prototype.onDisclaimerAgreed_ = function(opt_event) {
  this.userModel_.setHasAgreedToDisclaimer(true);

  // Proceed: Tour > Main UI
  if (!this.userModel_.hasSeenTour() && SchedulePlannerConfig.ENABLE_TOURS) {
    this.view_.getTourView().show();
  }
};


/**
 * Event handler; called when user marks tour as seen.
 * @param {SchedulePlannerEvent=} opt_event
 */
SchedulePlannerController.prototype.onTourSeen_ = function(opt_event) {
  this.userModel_.setHasSeenTour(true);
};


/**
 * Event handler; called when user model is fully loaded from backend.
 * @param {!org.riceapps.models.UserModel} userModel
 * @private
 */
SchedulePlannerController.prototype.onUserModelReady_ = function(userModel) {
  window.console.log('SchedulePlannerController.onUserModelReady_', userModel);
  this.userModel_ = userModel;
  this.onUserModelAndCoursesReady_();
};


/**
 * Event handler; called when search view should be updated.
 * @param {!SchedulePlannerEvent} event
 * @private
 */
SchedulePlannerController.prototype.handleUpdateSearch_ = function(event) {
  if (!this.coursesModel_) {
    return;
  }

  window.console.log('SchedulePlannerController.handleUpdateSearch_');

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
 * Event handler; called when a course view is no longer being dragged.
 * @param {goog.events.Event} event
 */
SchedulePlannerController.prototype.onCourseViewDragEnd_ = function(event) {
  // Force the calendar view to re-draw items located on the calendar since the guide views will have disappeared.
  this.view_.getCalendarView().relayout();
};

/**
 * Event handler; called when a course view starts to be dragged.
 * @param {goog.events.Event} event
 */
SchedulePlannerController.prototype.onCourseViewDragStart_ = function(event) {
  // Close the search view when dragging from playground.
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
    listen(this.view_, DraggableView.EventType.DRAGEND, this.onCourseViewDragEnd_).
    listen(this.view_, DraggableView.EventType.DRAGSTART, this.onCourseViewDragStart_).
    listen(this.view_, SchedulePlannerEvent.Type.ADD_GUIDE_VIEWS, this.handleAddGuideViews_).
    listen(this.xhrController_, SchedulePlannerXhrEvent.Type.XHR_FAILED, this.handleXhrFailed_);

  this.xhrController_.getUserModel().then(this.onUserModelReady_, this.onXhrError_, this);
  this.xhrController_.getAllCourses().then(this.onCoursesReady_, this.onXhrError_, this);
};


/**
 * Event handler; called when an XHR request fails.
 * @param {!SchedulePlannerXhrEvent} event
 */
SchedulePlannerController.prototype.handleXhrFailed_ = function(event) {
  window.console.log('[XhrEvent] SchedulePlannerController.handleXhrFailed_', event);
  this.view_.getLoadingInterruptView().hide();
  this.view_.getErrorInterruptView().show();
};


});  // goog.scope
