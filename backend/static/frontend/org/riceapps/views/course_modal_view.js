goog.provide('org.riceapps.views.CourseModalView');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.views.ModalView');

goog.scope(function() {



/**
 * @param {!org.riceapps.models.CourseModel} courseModel
 * @extends {org.riceapps.views.ModalView}
 * @constructor
 */
org.riceapps.views.CourseModalView = function(courseModel) {
  goog.base(this);

  /** @private {!org.riceapps.models.CourseModel} */
  this.courseModel_ = courseModel;

  /** @private {Element} */
  this.evaluationsLink_ = null;
};
goog.inherits(org.riceapps.views.CourseModalView,
              org.riceapps.views.ModalView);
var CourseModalView = org.riceapps.views.CourseModalView;


/** @enum {string} */
CourseModalView.Messages = {
  OPEN_EVALUATIONS: 'View Course Evaluations'
};


/**
 * @override
 */
CourseModalView.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.evaluationsLink_ = goog.dom.createDom(goog.dom.TagName.A, {
    'href': 'javascript:;'
  });
  goog.dom.setTextContent(this.evaluationsLink_, CourseModalView.Messages.OPEN_EVALUATIONS);
  goog.dom.appendChild(this.getElement(), this.evaluationsLink_);
};


/**
 * @override
 */
CourseModalView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.getHandler().listen(this.evaluationsLink_, goog.events.EventType.CLICK, this.onEvaluationsClicked_);
};


/**
 * @override
 */
CourseModalView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().unlisten(this.evaluationsLink_, goog.events.EventType.CLICK, this.onEvaluationsClicked_);
};


/**
 * @param {goog.events.BrowserEvent} event
 * @private
 */
CourseModalView.prototype.onEvaluationsClicked_ = function(event) {
  event.preventDefault();
  this.openCourseEvaluations();
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
CourseModalView.prototype.openCourseEvaluations = function() {
  var form = goog.dom.createDom(goog.dom.TagName.FORM, {
    'target': '_blank',
    'action': 'https://esther.rice.edu/selfserve/swkscmt.main',
    'method': 'POST'
  });

  var params = {
    'p_commentid': '',
    'p_confirm': '1',
    'p_term': this.courseModel_.getFormattedTermCode(),
    'p_type': 'Course',
    'p_crn': this.courseModel_.getCrn()
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

});  // goog.scope
