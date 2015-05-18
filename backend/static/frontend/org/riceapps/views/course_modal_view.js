goog.provide('org.riceapps.views.CourseModalView');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.dom.TagName');
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
  OPEN_EVALUATIONS: 'View Course Evaluations (You must already be logged in to ESTHER)',
  OPEN_COURSES: 'View On Rice Course Catalog',
  TAUGHT_BY: 'Taught By: ',
  SECTIONS: 'Sections',
  OFFERED: 'Offered: ',
  CROSSLISTED_AS: 'Crosslisted As: '
};


/** @enum {string} */
CourseModalView.Theme = {
  BASE: 'course-modal-view',
  TITLE: 'title',
  SUBTITLE: 'subtitle',
  TEXT: 'text'
};


/**
 * @override
 */
CourseModalView.prototype.createDom = function() {
  // College
  // Department
  // School
  // Session
  // Grade Mode
  // Last Update

  goog.base(this, 'createDom');
  goog.dom.classlist.add(this.getElement(), CourseModalView.Theme.BASE);
  var element, table, row, cell, i;

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TITLE);
  goog.dom.setTextContent(element, this.courseModel_.getTitle());
  goog.dom.appendChild(this.getElement(), element);

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.SUBTITLE);
  goog.dom.setTextContent(element, CourseModalView.Messages.TAUGHT_BY + this.courseModel_.getInstructorNames());
  goog.dom.appendChild(this.getElement(), element);

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.SUBTITLE);
  goog.dom.setTextContent(element, CourseModalView.Messages.OFFERED + this.courseModel_.getTermAsString() + ' ' +
      this.courseModel_.getYear());
  goog.dom.appendChild(this.getElement(), element);

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.SUBTITLE);
  goog.dom.setTextContent(element, 'Credit Hours: ' + this.courseModel_.getCreditsAsString());
  goog.dom.appendChild(this.getElement(), element);


  if (this.courseModel_.isCrosslisted()) {
    element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.SUBTITLE);
    goog.dom.setTextContent(element, CourseModalView.Messages.CROSSLISTED_AS +
        this.courseModel_.getAllCrosslistedSectionsAsString());
    goog.dom.appendChild(this.getElement(), element);
  }

  if (this.courseModel_.getDistributionType() != 0) {
    element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.SUBTITLE);
    goog.dom.setTextContent(element, 'Distribution Group: ' + this.courseModel_.getDistributionType());
    goog.dom.appendChild(this.getElement(), element);
  }

  if (this.courseModel_.isLpap()) {
    element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.SUBTITLE);
    goog.dom.setTextContent(element, 'Fulfills LPAP requirement');
    goog.dom.appendChild(this.getElement(), element);
  }

  // Description
  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TITLE);
  goog.dom.setTextContent(element, 'Description');
  goog.dom.appendChild(this.getElement(), element);

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TEXT);
  goog.dom.setTextContent(element, this.courseModel_.getDescription());
  goog.dom.appendChild(this.getElement(), element);


  // Restrictions
  var restrictions = this.courseModel_.getRestrictions();

  if (restrictions.length > 0) {
    element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TITLE);
    goog.dom.setTextContent(element, 'Restrictions');
    goog.dom.appendChild(this.getElement(), element);

    for (i = 0; i < restrictions.length; i++) {
      element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TEXT);
      goog.dom.setTextContent(element, restrictions[i]);
      goog.dom.appendChild(this.getElement(), element);
    }
  }

  // Course Sections and Meeting Times
  var sections = this.courseModel_.getAllSections();
  sections.sort(function(a, b) {
    return a.getSection() - b.getSection();
  });

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TITLE);
  goog.dom.setTextContent(element, 'Sections (' + sections.length  + ')');
  goog.dom.appendChild(this.getElement(), element);

  table = goog.dom.createDom(goog.dom.TagName.TABLE);
  goog.dom.appendChild(this.getElement(), table);

  row = goog.dom.createDom(goog.dom.TagName.TR);
  goog.dom.appendChild(table, row);

  cell = goog.dom.createDom(goog.dom.TagName.TH);
  goog.style.setStyle(cell, {
    'width': '80px'
  });
  goog.dom.setTextContent(cell, 'Section');
  goog.dom.appendChild(row, cell);

  cell = goog.dom.createDom(goog.dom.TagName.TH);
  goog.style.setStyle(cell, {
    'width': '80px'
  });
  goog.dom.setTextContent(cell, 'CRN');
  goog.dom.appendChild(row, cell);

  cell = goog.dom.createDom(goog.dom.TagName.TH);
  goog.style.setStyle(cell, {
    'width': '50px'
  });
  goog.dom.setTextContent(cell, 'Enrolled');
  goog.dom.appendChild(row, cell);

  cell = goog.dom.createDom(goog.dom.TagName.TH);
  goog.style.setStyle(cell, {
    'width': '50px'
  });
  goog.dom.setTextContent(cell, 'Waitlisted');
  goog.dom.appendChild(row, cell);

  cell = goog.dom.createDom(goog.dom.TagName.TH);
  goog.dom.setTextContent(cell, 'Meeting Times/Locations');
  goog.dom.appendChild(row, cell);

  for (i = 0; i < sections.length; i++) {
    row = goog.dom.createDom(goog.dom.TagName.TR);
    goog.dom.appendChild(table, row);

    cell = goog.dom.createDom(goog.dom.TagName.TD);
    goog.dom.setTextContent(cell, sections[i].getSection());
    goog.dom.appendChild(row, cell);

    cell = goog.dom.createDom(goog.dom.TagName.TD);
    goog.dom.setTextContent(cell, sections[i].getCrn());
    goog.dom.appendChild(row, cell);

    cell = goog.dom.createDom(goog.dom.TagName.TD);
    goog.dom.setTextContent(cell, sections[i].getTotalEnrollmentAsString());
    goog.dom.appendChild(row, cell);

    cell = goog.dom.createDom(goog.dom.TagName.TD);
    goog.dom.setTextContent(cell, sections[i].getTotalWaitlistedAsString());
    goog.dom.appendChild(row, cell);

    cell = goog.dom.createDom(goog.dom.TagName.TD);
    goog.dom.setTextContent(cell, sections[i].getMeetingTimesAsString());
    goog.dom.appendChild(row, cell);
  }

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TEXT);
  goog.dom.setTextContent(element, 'Note: Listed enrollment data is updated periodically and may not be accurate.');
  goog.dom.appendChild(this.getElement(), element);

  // Links
  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TITLE);
  goog.dom.setTextContent(element, 'Additional Information');
  goog.dom.appendChild(this.getElement(), element);

  // Add course URL.
  if (this.courseModel_.getCourseUrl().length > 0) {
    element = goog.dom.createDom(goog.dom.TagName.A, {
      'href': this.courseModel_.getCourseUrl(),
      'target': '_blank'
    });
    goog.dom.setTextContent(element, 'View Course Syllabus');
    goog.dom.appendChild(this.getElement(),element);

    element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TEXT);
    goog.dom.setTextContent(element, ' ');
    goog.dom.appendChild(this.getElement(), element);
  };

  // Add courses.rice.edu link.
  element = goog.dom.createDom(goog.dom.TagName.A, {
    'href': this.courseModel_.getLink(),
    'target': '_blank'
  });
  goog.dom.setTextContent(element, CourseModalView.Messages.OPEN_COURSES);
  goog.dom.appendChild(this.getElement(),element);

  element = goog.dom.createDom(goog.dom.TagName.DIV, CourseModalView.Theme.TEXT);
  goog.dom.setTextContent(element, ' ');
  goog.dom.appendChild(this.getElement(), element);

  // Add evaluations link
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

  var newEvent = new SchedulePlannerEvent(SchedulePlannerEvent.Type.SHOW_COURSE_EVALS);
  newEvent.model = this.courseModel_;
  this.dispatchEvent(newEvent);
};

});  // goog.scope
