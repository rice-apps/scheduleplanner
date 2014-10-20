/**
 * @author Matthew Schurr (mschurr@rice.edu)
 */

jslib.provides('org.riceapps.scheduleplanner.controllers.MainController');

jslib.scope(function(){
var UserModel = org.riceapps.scheduleplanner.models.UserModel;
var DraggableView = org.riceapps.scheduleplanner.views.DraggableView;
var DroppableView = org.riceapps.scheduleplanner.views.DroppableView;
var DraggableCourseView = org.riceapps.scheduleplanner.views.DraggableCourseView;
var DraggableCalendarItemView = org.riceapps.scheduleplanner.views.DraggableCalendarItemView;
var DroppableCalendarItemView = org.riceapps.scheduleplanner.views.DroppableCalendarItemView;
var ModalView = org.riceapps.scheduleplanner.views.ModalView;

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.controllers.Controller}
 */
org.riceapps.scheduleplanner.controllers.MainController = function() {
	this.superConstructor();

	/** @private {CalendarView} */
	this.calendarView_ = new org.riceapps.scheduleplanner.views.CalendarView();

	/** @private {View} */
	this.trashView_ = new org.riceapps.scheduleplanner.views.TrashView();

	/** @private {PlaygroundView} */
	this.playgroundView_ = new org.riceapps.scheduleplanner.views.PlaygroundView();

	/** @private {View} */
	this.searchView_ = null;

	/** @private {View} */
	this.toolbarView_ = null;

	/** @private {View} */
	this.modalView_ = null;

	/** @private {UserModel} */
	this.userModel_ = new org.riceapps.scheduleplanner.models.UserModel();

	/** @private {Object.<number, boolean>} */
	this.playgroundPending_ = {};

	/** @private {Object.<number, boolean>} */
	this.schedulePending_ = {};

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.controllers.MainController,
	           org.riceapps.scheduleplanner.controllers.Controller);
var MainController = org.riceapps.scheduleplanner.controllers.MainController;

/**
 * Initializes the controller rendering views, listening for events, and loading data.
 */
MainController.prototype.initialize = function() {
	// Render views.
	this.calendarView_.renderIn( $("#calendar")[0] );
	this.playgroundView_.renderIn( $("#playground")[0] );
	this.trashView_.renderIn( $("#trash")[0] );

	// Bind events.
	this.subscribe(this.userModel_, UserModel.Event.SCHEDULE_LOADED, this.onScheduleLoaded_);
	this.subscribe(this.userModel_, UserModel.Event.PLAYGROUND_LOADED, this.onPlaygroundLoaded_);
	this.subscribe(this.userModel_, UserModel.Event.COURSE_LOADED, this.onCourseLoaded_);
	this.subscribe(this.playgroundView_, DroppableView.Event.DROPPED, this.onPlaygroundDropCalendarItem_);
	this.subscribe(this.trashView_, DroppableView.Event.DROPPED, this.onTrashDrop_);

	// Start loading initial data from the server.
	this.userModel_.getSchedule();
	this.userModel_.getPlayground();
};

/**
 * Called when playground data is retrieved by the model.
 * @param {UserModel} userModel
 * @param {Array.<number>} data
 * @private
 */
MainController.prototype.onPlaygroundLoaded_ = function(userModel, data) {
	jslib.log('Retrieved playground data from server.');

	for(var i = 0; i < data.length; i++) {
		this.playgroundPending_[data[i]] = true;
	}

	this.userModel_.getCourses(data);
};

/**
 * Called when schedule data is retrieved by the model.
 * @param {UserModel} userModel
 * @param {Array.<number>} data
 * @private
 */
MainController.prototype.onScheduleLoaded_ = function(userModel, data) {
	jslib.log('Retrieved schedule data from server.');

	for(var i = 0; i < data.length; i++) {
		this.schedulePending_[data[i]] = true;
	}

	this.userModel_.getCourses(data);
};

/**
 * Called when course data is retrieved by the model.
 * @param {UserModel} userModel
 * @param {!number} courseId
 * @param {Object} data
 * @private
 */
MainController.prototype.onCourseLoaded_ = function(userModel, courseId, data) {
	jslib.log('Retrieved course data [' + courseId + '] from server.');
	this.processPendingScheduleItems_(courseId, data);
	this.processPendingPlaygroundItems_(courseId, data);
};

/**
 * Processes playground items that are waiting on course data.
 * @param {!number} courseId
 * @param {Object} data
 * @private
 */
MainController.prototype.processPendingPlaygroundItems_ = function(courseId, data) {
	if(!(courseId in this.playgroundPending_))
		return;

	delete this.playgroundPending_[courseId];

	var view = new DraggableCourseView(courseId, data["title"], data["times"]);
	this.subscribe(view, DraggableView.Event.CLICKED,      this.onPlaygroundCourseClick_);
	this.subscribe(view, DraggableView.Event.DRAG_STARTED, this.onPlaygroundCourseDragStart_);
	this.subscribe(view, DraggableView.Event.DRAG_ENDED,   this.onPlaygroundCourseDragEnd_);
	this.playgroundView_.addChild(view);
	this.trashView_.accepts(view);
};

/**
 * Processes schedule items that are waiting on course data.
 * @param {!number} courseId
 * @param {Object} data
 * @private
 */
MainController.prototype.processPendingScheduleItems_ = function(courseId, data) {
	if(!(courseId in this.schedulePending_))
		return;

	delete this.schedulePending_[courseId];

	var view = new DraggableCalendarItemView(courseId, data["title"], data["times"]);
	this.subscribe(view, DraggableView.Event.CLICKED,      this.onCalendarItemClick_);
	this.subscribe(view, DraggableView.Event.DRAG_STARTED, this.onCalendarItemDragStart_);
	this.subscribe(view, DraggableView.Event.DRAG_ENDED,   this.onCalendarItemDragStop_);
	this.playgroundView_.accepts(view);
	this.trashView_.accepts(view);
	this.calendarView_.addChild(view);
};

/**
 * Called when a calendar item is dropped onto the playground.
 * @param {org.riceapps.scheduleplanner.views.PlaygroundView} playgroundView
 * @param {DraggableCalendarItemView} calendarItemView
 * @private
 */
MainController.prototype.onPlaygroundDropCalendarItem_ = function(playgroundView, calendarItemView) {
	// Destroy any guides created.
	var guides = calendarItemView.getGuides();

	for(var i = 0; i < guides.length; i++) {
		guides[i].destroy();
	}

	// Remove the view from the calendar.
	calendarItemView.destroy();

	// TODO(mschurr): Move from calendar to playground in database. Handle errors, expiration of session.

	// Add a view to the playground.
	var view = new DraggableCourseView(
		calendarItemView.getCourseId(), 
		calendarItemView.getTitle(), 
		calendarItemView.getTimes());
	this.subscribe(view, DraggableView.Event.CLICKED,      this.onPlaygroundCourseClick_);
	this.subscribe(view, DraggableView.Event.DRAG_STARTED, this.onPlaygroundCourseDragStart_);
	this.subscribe(view, DraggableView.Event.DRAG_ENDED,   this.onPlaygroundCourseDragEnd_);
	this.playgroundView_.addChild(view);
	this.trashView_.accepts(view);
};

/**
 * Called when a course is dragged from the playground.
 * @param {DraggableCourseView} courseView
 * @private
 */
MainController.prototype.onPlaygroundCourseDragStart_ = function(courseView) {
	var guideView = new DroppableCalendarItemView(
		courseView.getCourseId(),
		courseView.getTitle(),
		courseView.getTimes());
	
	this.subscribe(guideView, DroppableView.Event.DROPPED, this.onCalendarDropCourseFromPlayground_);
	guideView.accepts(courseView);
	this.calendarView_.addChild(guideView);
	courseView.setGuides([guideView]);
};

/**
 * Called when a course dragged from the playground stops being dragged.
 * @param {DraggableCourseView} courseView
 * @private
 */
MainController.prototype.onPlaygroundCourseDragEnd_ = function(courseView) {
	// Destroy any guides created.
	var guides = courseView.getGuides();

	for(var i = 0; i < guides.length; i++) {
		guides[i].destroy();
	}
};

/**
 * Called when a course dragged from the playground is dropped on a calendar guide.
 * @param {DroppableCalendarItemView} guideView
 * @param {DraggableCourseView} courseView
 * @private
 */
MainController.prototype.onCalendarDropCourseFromPlayground_ = function(guideView, courseView) {
	// Destroy any guides created.
	var guides = courseView.getGuides();

	for(var i = 0; i < guides.length; i++) {
		guides[i].destroy();
	}

	// Remove the course view.
	courseView.destroy();

	// TODO(mschurr): Move from playground to calendar in DB. Handle errors, expiration.

	// Add a view to the calendar.
	var view = new DraggableCalendarItemView(
		courseView.getCourseId(),
		courseView.getTitle(),
		courseView.getTimes());
	this.subscribe(view, DraggableView.Event.CLICKED,      this.onCalendarItemClick_);
	this.subscribe(view, DraggableView.Event.DRAG_STARTED, this.onCalendarItemDragStart_);
	this.subscribe(view, DraggableView.Event.DRAG_ENDED,   this.onCalendarItemDragStop_);
	this.playgroundView_.accepts(view);
	this.trashView_.accepts(view);
	this.calendarView_.addChild(view);
};

// ---------------------- methods below are experimental or incomplete
/*
TODO:
	calendar_view:
		- Support multiple items in the same time slot
		- Can't drop course back on where it was picked up from.
		- Draggable courses can create horiz scroll bar when calculating drag handle
	droppable_view:
		- Background transitions when moving between elements within the droppable
	playground_view:
		- Message about what to do if empty

	need an export option somewhere for registration CRNs
*/

MainController.prototype.onCalendarItemDragStart_ = function(calendarItemView) {
	var guideView = new DroppableCalendarItemView(
		calendarItemView.getCourseId(),
		calendarItemView.getTitle(),
		calendarItemView.getTimes());
	
	this.subscribe(guideView, DroppableView.Event.DROPPED, this.onCalendarDropCourseFromCalendar_);
	guideView.accepts(calendarItemView);
	this.calendarView_.addChild(guideView);
	calendarItemView.setGuides([guideView]);
};

MainController.prototype.onCalendarItemDragStop_ = function(calendarItemView) {
	// Destroy any guides created.
	var guides = calendarItemView.getGuides();

	for(var i = 0; i < guides.length; i++) {
		guides[i].destroy();
	}
};

MainController.prototype.onCalendarDropCourseFromPlayground = function(guideView, calendarItemView) {
	window.console.log('drop');
};

MainController.prototype.onCalendarItemClick_ = function(calendarItemView) {
	var view = new ModalView();
	this.subscribe(view, ModalView.Event.CLOSED, this.onModalViewClosed_);
	view.show();
};

MainController.prototype.onPlaygroundCourseClick_ = function(courseView) {
	var view = new ModalView();
	this.subscribe(view, ModalView.Event.CLOSED, this.onModalViewClosed_);
	view.show();
};

MainController.prototype.onModalViewClosed_ = function(modalView) {
	modalView.destroy();
};

/**
 * @param {DraggableCourseView|DraggableCalendarItemView} otherView
 */
MainController.prototype.onTrashDrop_ = function(trashView, otherView) {
	var guides = otherView.getGuides();

	for(var i = 0; i < guides.length; i++) {
		guides[i].destroy();
	}

	otherView.destroy();

	if(jslib.is(otherView, DraggableCourseView)) {
		// TODO(mschurr): Remove the course from the playground.
	} else {
		// TODO(mschurr): Remove the course from the schedule.
	}
};

});