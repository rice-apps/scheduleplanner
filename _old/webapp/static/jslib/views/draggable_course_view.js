/**
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.views.DraggableCourseView');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.views.DraggableView}
 * @param {!number} id
 * @param {!string} title
 * @param {!Array.<Object>} times
 */
org.riceapps.scheduleplanner.views.DraggableCourseView = function(courseId, title, times) {
	this.superConstructor();

	/** @protected {!string} */
	this.title_ = title;

	/** @protected {!number} */
	this.courseId_ = courseId;

	/** @protected {!Array.<Object>} */
	this.times_ = times;

	/** @protected {!Array.<View>} */
	this.guides_ = [];

	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.views.DraggableCourseView,
	           org.riceapps.scheduleplanner.views.DraggableView);
var DraggableCourseView = org.riceapps.scheduleplanner.views.DraggableCourseView;

/**
 * Returns the course ID bound to the view.
 * @return {!number}
 */
DraggableCourseView.prototype.getCourseId = function() {
	return this.courseId_;
};

/**
 * Returns the title bound to the view.
 * @return {!string}
 */
DraggableCourseView.prototype.getTitle = function() {
	return this.title_;
};

/**
 * Returns the guides bound to the view.
 * @return {Array.<View>}
 */
DraggableCourseView.prototype.getGuides = function() {
	return this.guides_;
};

/**
 * Sets the view's guides.
 * @param {Array.<View>} guides
 */
DraggableCourseView.prototype.setGuides = function(guides) {
	this.guides_ = guides;
};

/**
 * Returns the times bound to the view.
 * @return {!Array.<Object>}
 */
DraggableCourseView.prototype.getTimes = function() {
	return this.times_;
};

/**
 * @override
 */
DraggableCourseView.prototype.renderIn = function(target) {
	this.super('renderIn', target);
	$(this.dom_).text(this.title_).addClass('courseview');
};

/**
 * @override
 */
DraggableCourseView.prototype.onDragStart_ = function(event) {
	this.super('onDragStart_', event);
	$(this.dom_).fadeOut("slow");
};

/**
 * @override
 */
DraggableCourseView.prototype.onDragEnd_ = function(event) {
	this.super('onDragEnd_', event);
	$(this.dom_).fadeIn("slow");
};

/**
 * @override
 */
DraggableCourseView.prototype.destroy = function() {
	this.super('destroy');
	$(this.dom_).remove();
};

});