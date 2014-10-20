main_controller
playground_view
droppable_view
draggable_calendar_item
draggable_view
draggable_course_view
draggable_calendar_item_view
calendar_view

/**
 * @param {UserModel} model
 * @param {?Object} data
 * @protected
 */
MainController.prototype.onPlaygroundLoaded_ = function(model, data) {
	for(var i = 0; i < data.length; i++) {
		this.playgroundPending_[data[i]] = true;
	}

	this.userModel_.getCourses(data);
};

/**
 * @param {UserModel} model
 * @param {?Object} data
 * @protected
 */
MainController.prototype.onScheduleLoaded_ = function(model, data) {
	for(var i = 0; i < data.length; i++) {
		this.schedulePending_[data[i]] = true;
	}

	this.userModel_.getCourses(data);
};


/**
 * @param {UserModel} model
 * @param {number} courseId
 * @param {Object} data
 * @protected
 */
MainController.prototype.onCourseLoaded_ = function(model, courseId, data) {
	// Handle adding courses to the playground.

	// Handle added courses to the schedule.
	}

	// Handle dragging courses.
	if(courseId in this.guidePending_) {
		/*window.console.log("guide");
		var title = data["subject"] + " " + data["course_number"];
		var guide = new DroppableCalendarItemView(courseId, title, data["times"]);
		this.subscribe(guide, 'calendarItemDrop', this.onCalendarDrop_);
		guide.accepts(view);
		this.calendarView_.addChild(guide);*/
		delete this.guidePending_[courseId];
	}
};

/**
 * @param {DraggableCourseView|DraggableCalendarItemView} view
 * @protected
 */
MainController.prototype.onCourseViewClicked_ = function(view) {
	var courseId = view.getCourseId();
};

/**
 * @param {DraggableCourseView|DraggableCalendarItemView} view
 * @protected
 */
MainController.prototype.onCourseViewDragStart_ = function(view) {
	var courseId = view.getCourseId();
	this.guidePending_[courseId] = true;
	//this.playgroundView_.accepts(view);
	this.userModel_.getCourses([courseId]);

	// Show trashcan.
	//this.trashView_.accepts(view);
	//this.trashView_.show();
};