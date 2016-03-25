/**
 * A pop-up view that displays evaluations for a single course.
 * NOTE: We cannot implement this view until we are given access to evaluations data by the university.
 */
goog.provide('org.riceapps.views.EvaluationsModalView');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.views.ModalView');

goog.scope(function() {
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



/**
 * @param {!org.riceapps.models.CourseModel} courseModel
 * @extends {org.riceapps.views.ModalView}
 * @constructor
 */
org.riceapps.views.EvaluationsModalView = function(courseModel) {
  goog.base(this);

  /** @private {!org.riceapps.models.CourseModel} */
  this.courseModel_ = courseModel;
};
goog.inherits(org.riceapps.views.EvaluationsModalView,
              org.riceapps.views.ModalView);
var EvaluationsModalView = org.riceapps.views.EvaluationsModalView;


/** @enum {string} */
EvaluationsModalView.Messages = {
};


/** @enum {string} */
EvaluationsModalView.Theme = {
};


/**
 * @override
 */
EvaluationsModalView.prototype.createDom = function() {
  goog.base(this, 'createDom');
};


/**
 * @override
 */
EvaluationsModalView.prototype.show = function(opt_preventAnimation) {
  goog.base(this, 'show', opt_preventAnimation);

  var scroll = goog.dom.getDomHelper().getDocumentScroll();
  goog.style.setStyle(this.getElement(), {
    'top': 'calc(10% + ' + scroll.y + 'px)'
  });
};


/**
 * @override
 */
EvaluationsModalView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * @override
 */
EvaluationsModalView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
  this.getHandler().removeAll();
};

});  // goog.scope
