/**
 * A simple modal view which lists the names and CRNs of all courses on the calendar and playground, giving the user easy
 * access to the information they need when registering for classes.
 */

goog.provide('org.riceapps.views.CRNModalView');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventType');
goog.require('org.riceapps.views.ModalView');


goog.scope(function() {

/**
 * @param {!org.riceapps.models.UserModel} userModel
 * @extends {org.riceapps.views.ModalView}
 * @constructor
 */
org.riceapps.views.CRNModalView = function(userModel) {
  goog.base(this);

  /** @private {!org.riceapps.models.UserModel} */
  this.userModel_ = userModel;
};
goog.inherits(org.riceapps.views.CRNModalView,
              org.riceapps.views.ModalView);
var CRNModalView = org.riceapps.views.CRNModalView;

/** @enum {string} */
CRNModalView.Theme = {
  BASE: 'crn-modal-view',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
  CONTAINER: 'container',
  TEXT: 'text'
};


/**
 * @override
 */
CRNModalView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CRNModalView.Theme.BASE);

  var element, i, crn, coursename, courses;

  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.TITLE);
  goog.dom.setTextContent(element, 'CRNs (for ESTHER Registration)');
  goog.dom.appendChild(this.getElement(), element);

  var container = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.CONTAINER);
  goog.dom.appendChild(this.getElement(), container);

  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.SUBTITLE);
  goog.dom.setTextContent(element, 'CRNs (in Schedule):');
  goog.dom.appendChild(container, element);

  courses = this.userModel_.getCoursesInSchedule();

  for (i = 0; i < courses.length; i++) {
    var div = goog.dom.createDom(goog.dom.TagName.DIV);
    goog.dom.appendChild(container, div);
    goog.style.setStyle(div, {'margin': '3px'});
    goog.dom.setTextContent(div, courses[i].getTitle());

    crn = courses[i].getCrn();
    coursename = courses[i].getCourseCategory();
    element = goog.dom.createDom(goog.dom.TagName.INPUT, {
      'type': 'text',
      'value': crn
    });
    element.readOnly = true;
    goog.style.setStyle(element, {'display': 'block', 'margin': '3px'});

    this.getHandler().
      listen(element, goog.events.EventType.FOCUS, function(event) {
        event.preventDefault();
        var target = event.target;
        window.setTimeout(function() {
          target.setSelectionRange(0, target.value.length);
        }, 10);
      });

    goog.dom.appendChild(div, element);
  }

  element = goog.dom.createDom(goog.dom.TagName.DIV, CRNModalView.Theme.SUBTITLE);
  goog.dom.setTextContent(element, 'CRNs (in Staging Area):');
  goog.dom.appendChild(container, element);

  courses = this.userModel_.getCoursesInPlayground();

  for (i = 0; i < courses.length; i++) {
    var div = goog.dom.createDom(goog.dom.TagName.DIV);
    goog.dom.appendChild(container, div);
    goog.style.setStyle(div, {'margin': '3px'});
    goog.dom.setTextContent(div, courses[i].getTitle());

    crn = courses[i].getCrn();
    coursename = courses[i].getCourseCategory();
    element = goog.dom.createDom(goog.dom.TagName.INPUT, {
      'type': 'text',
      'value': crn
    });
    element.readOnly = true;
    goog.style.setStyle(element, {'display': 'block', 'margin': '3px'});

    this.getHandler().
      listen(element, goog.events.EventType.FOCUS, function(event) {
        event.preventDefault();
        var target = event.target;
        window.setTimeout(function() {
          target.setSelectionRange(0, target.value.length);
        }, 10);
      });

    goog.dom.appendChild(div, element);
  }

};

});  // goog.scope
