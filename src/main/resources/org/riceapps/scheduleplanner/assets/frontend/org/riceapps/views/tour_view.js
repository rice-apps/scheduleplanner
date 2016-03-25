/**
 * A pop-up slideshow view which provides the user with instructions on how to utilize the application.
 */

goog.provide('org.riceapps.views.TourView');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyEvent');
goog.require('goog.style');
goog.require('org.riceapps.events.SchedulePlannerEvent');
goog.require('org.riceapps.fx.Animation');
goog.require('org.riceapps.views.View');

goog.scope(function() {
var Animation = org.riceapps.fx.Animation;
var SchedulePlannerEvent = org.riceapps.events.SchedulePlannerEvent;



/**
 * @param {!org.riceapps.views.SchedulePlannerView} schedulePlannerView
 * @extends {org.riceapps.views.View}
 * @constructor
 */
org.riceapps.views.TourView = function(schedulePlannerView) {
  goog.base(this);

  /** @private {!org.riceapps.views.SchedulePlannerView} */
  this.schedulePlannerView_ = schedulePlannerView;

  /** @private {!Element} */
  this.transparentOverlay_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.OVERLAY);

  /** @private {!Element} */
  this.exitButton_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.EXIT);

  /** @private {!Element} */
  this.nextButton_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.NEXT);

  /** @private {!Element} */
  this.rightExitButton_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.NEXT);

  /** @private {!Element} */
  this.prevButton_ = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.PREV);

  /** @private {!Array.<!Element>} */
  this.explanations_ = [];

  /** @private {number} */
  this.stage_ = 0;

  /** @private {number} */
  this.activeStage_ = -1;
};
goog.inherits(org.riceapps.views.TourView,
              org.riceapps.views.View);
var TourView = org.riceapps.views.TourView;


/** @enum {string} */
TourView.Theme = {
  BASE: 'tour-view',
  OVERLAY: 'tour-view-overlay',
  FRAME: 'tour-view-frame',
  EXIT: 'tour-view-exit',
  NEXT: 'tour-view-next',
  PREV: 'tour-view-prev'
};


/**
 * @override
 */
TourView.prototype.createDom = function() {
  goog.base(this, 'createDom');
  goog.style.setElementShown(this.getElement(), false);
  goog.dom.classlist.add(this.getElement(), TourView.Theme.BASE);
  goog.dom.setTextContent(this.exitButton_, 'EXIT TOUR');
  goog.dom.appendChild(this.getElement(), this.exitButton_);
  goog.dom.setTextContent(this.nextButton_, 'NEXT');
  goog.dom.appendChild(this.getElement(), this.nextButton_);
  goog.dom.setTextContent(this.rightExitButton_, 'FINISH');
  goog.dom.appendChild(this.getElement(), this.rightExitButton_);
  goog.dom.setTextContent(this.prevButton_, 'PREVIOUS');
  goog.dom.appendChild(this.getElement(), this.prevButton_);

  this.createFrames_();
};


/**
 * Creates and returns an element representing a frame in the slide show.
 * Appends the frame to the end of the slideshow.
 * @return {!Element}
 * @private
 */
TourView.prototype.getFreshFrame_ = function() {
  var item = goog.dom.createDom(goog.dom.TagName.DIV, TourView.Theme.FRAME);
  goog.style.setElementShown(item, false);
  goog.dom.appendChild(this.getElement(), item);
  this.explanations_.push(item);
  return item;
};


/**
 * @param {string} headerText
 * @param {string} bodyText
 * @param {string} imageClass
 * @private
 */
TourView.prototype.createInfoFrame_ = function(headerText, bodyText, imageClass) {
  var frame = this.getFreshFrame_();
  var section = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-section');
  var header = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-header');
  var text = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-text');
  var image = goog.dom.createDom(goog.dom.TagName.DIV, imageClass);
  goog.dom.appendChild(section, header);
  goog.dom.appendChild(section, text);
  goog.dom.appendChild(section, image);
  goog.dom.appendChild(frame, section);
  goog.dom.setTextContent(header, headerText);
  goog.dom.setTextContent(text, bodyText);
};


/**
 * @private
 */
TourView.prototype.createFrames_ = function() {
  var frame, section, header, text;

  // Frame: Welcome.
  frame = this.getFreshFrame_();

  header = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-title');
  goog.dom.setTextContent(header, 'Welcome to Rice Schedule Planner!');
  goog.dom.appendChild(frame, header);

  section = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-section');
  header = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-header-cloud');
  text = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-text');
  goog.dom.appendChild(section, header);
  goog.dom.appendChild(section, text);
  goog.dom.appendChild(frame, section);
  goog.dom.setTextContent(header, 'Cloud Powered');
  goog.dom.setTextContent(text, 'Your schedule is automatically saved and synchronized across your devices.');

  section = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-section');
  header = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-header-social');
  text = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-text');
  goog.dom.appendChild(section, header);
  goog.dom.appendChild(section, text);
  goog.dom.appendChild(frame, section);
  goog.dom.setTextContent(header, 'Socially Aware');
  goog.dom.setTextContent(text, 'Quickly and easily share your schedule with your friends (coming soon).');

  section = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-section');
  header = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-header-smart');
  text = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-text');
  goog.dom.appendChild(section, header);
  goog.dom.appendChild(section, text);
  goog.dom.appendChild(frame, section);
  goog.dom.setTextContent(header, 'Schedule Smarter, Not Harder');
  goog.dom.setTextContent(text, 'Specially designed to help you quickly and intuitively navigate the course catalog.');

  section = goog.dom.createDom(goog.dom.TagName.DIV, 'tour-view-splash-instructions');
  goog.dom.appendChild(frame, section);
  goog.dom.setTextContent(section, 'This tour will show you how to take advantage of the powerful features in ' +
      'Schedule Planner. To navigate the tour, use the arrow keys or click the next button on the right side of ' +
      'your screen.');

  // Frame: Finding Courses.
  this.createInfoFrame_('Use the search bar to find courses.',
      'You can drag the resulting courses out of the search panel onto the staging area or calendar. ' +
          'You can also use the more advanced filters located on the right side to fine tune your search.',
      'tour-view-image-search');

  // Frame: Staging
  this.createInfoFrame_('Stage the courses you are interested in taking.',
      'You can drag all of the courses you might want to take from the search results to the staging area where ' +
          'you can quickly move them to the calendar.',
      'tour-view-image-staging');

  // Frame: Calendar Scheduling
  this.createInfoFrame_('Schedule your courses.',
      'Drag courses from the search results or staging area onto the calendar guides. For courses with multiple ' +
          'sections, drop onto the section you want to take. You can pick up a course from the calendar to change ' +
          'sections or move it back to the staging area.',
      'tour-view-image-scheduling');

  // Frame: List View
  this.createInfoFrame_('Courses placed on your calendar will also appear in a list.',
      'The list gives an overview of the courses you are taking and contains the CRNs you need for registration.',
      'tour-view-image-list');

  // Frame: Deleting
  this.createInfoFrame_('Remove unwanted courses.',
      'Drop courses that you no longer are interested in on to the trash can to remove them. You can find them again ' +
          'later using the search bar.',
      'tour-view-image-deleting');

  // Frame: Course Info Modal
  this.createInfoFrame_('Click on any course to pull up additional information.',
      'You will be shown a popup with the course description, location, restrictions, and more!',
      'tour-view-image-info');

  // Frame: Context Menus
  this.createInfoFrame_('Right click on any course for additional options.',
      'The context menus provide convenient options for managing your courses.',
      'tour-view-image-context');
};


/**
 * @override
 */
TourView.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.hide(true);

  this.getHandler().
      listen(this.exitButton_, goog.events.EventType.CLICK, this.handleExitButtonClick_).
      listen(this.rightExitButton_, goog.events.EventType.CLICK, this.handleExitButtonClick_).
      listen(this.nextButton_, goog.events.EventType.CLICK, this.handleNextButtonClick_).
      listen(this.prevButton_, goog.events.EventType.CLICK, this.handlePrevButtonClick_).
      listen(document, goog.events.EventType.KEYUP, this.handleKeyUp_);
};


/**
 * @param {!goog.events.KeyEvent} event
 * @private
 */
TourView.prototype.handleKeyUp_ = function(event) {
  switch (event.keyCode) {
    case goog.events.KeyCodes.ESC:
      this.hide();
      this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.EXIT_TOUR));
      break;

    case goog.events.KeyCodes.LEFT:
      if (this.stage_ > 0) {
        this.prev();
      }
      break;

    case goog.events.KeyCodes.RIGHT:
      if (this.stage_ < this.explanations_.length - 1) {
        this.next();
      } else {
        this.handleExitButtonClick_();
      }
      break;
  }
};

/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
TourView.prototype.handleExitButtonClick_ = function(opt_event) {
  this.hide();
  this.dispatchEvent(new SchedulePlannerEvent(SchedulePlannerEvent.Type.EXIT_TOUR));
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
TourView.prototype.handleNextButtonClick_ = function(opt_event) {
  if (this.stage_ < this.explanations_.length - 1) {
    this.next();
  }
};


/**
 * @param {goog.events.BrowserEvent=} opt_event
 * @private
 */
TourView.prototype.handlePrevButtonClick_ = function(opt_event) {
  if (this.stage_ > 0) {
    this.prev();
  }
};


/**
 * @override
 */
TourView.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');

  this.getHandler().removeAll();
};


/**
 * Updates the stage it which the tour is at.
 * @param {number} stage
 */
TourView.prototype.setStage = function(stage) {
  if (!this.isShown()) {
    return;
  }

  this.stage_ = stage;
  this.renderStage_();
};


/**
 * Increments the stage by one.
 */
TourView.prototype.next = function() {
  this.setStage(this.stage_ + 1);
};

/**
 * Decrements the stage by one.
 */
TourView.prototype.prev = function() {
  this.setStage(this.stage_ - 1);
};


/**
 * @override
 */
TourView.prototype.show = function(opt_preventAnimation) {
  goog.base(this, 'show', opt_preventAnimation);

  goog.style.setStyle(document.body, {
    'overflow': 'hidden'
  });
  goog.style.setElementShown(this.getElement(), true);
  goog.style.setElementShown(this.nextButton_, false);
  goog.style.setElementShown(this.rightExitButton_, false);
  goog.style.setElementShown(this.prevButton_, false);
  goog.dom.appendChild(document.body, this.transparentOverlay_);

  if (!opt_preventAnimation) {
    Animation.start(this.exitButton_, Animation.Preset.FADE_IN);
    Animation.start(this.transparentOverlay_, Animation.Preset.FADE_IN);
  }

  this.stage_ = 0;
  this.activeStage_ = -1;
  this.renderStage_();
};


/**
 * @private
 */
TourView.prototype.renderStage_ = function() {
  var nextStage = this.stage_;
  var activeStage = this.activeStage_;
  var animation;
  this.activeStage_ = this.stage_;

  // If the stage has not changed, do nothing.
  if (nextStage == activeStage) {
    return;
  }

  // If the active stage is valid:
  if (activeStage >= 0 && activeStage < this.explanations_.length) {
    animation = Animation.Preset.ZOOM_OUT;
    if (nextStage >= 0 && nextStage < this.explanations_.length) {
      animation = (nextStage > activeStage ? Animation.Preset.FADE_OUT_LEFT : Animation.Preset.FADE_OUT_RIGHT);
    }

    // Animate out the active stage.
    Animation.start(this.explanations_[activeStage], animation).then(Animation.hideElement);
  }

  // If the next stage is valid:
  if (nextStage >= 0 && nextStage < this.explanations_.length) {
    animation = Animation.Preset.ZOOM_IN;
    if (activeStage >= 0 && activeStage < this.explanations_.length) {
      animation = (nextStage > activeStage ? Animation.Preset.FADE_IN_RIGHT : Animation.Preset.FADE_IN_LEFT);
    }

    // Animate in the next stage.
    goog.style.setElementShown(this.explanations_[nextStage], true);
    Animation.start(this.explanations_[nextStage], animation);
  } else {
    Animation.start(this.exitButton_, Animation.Preset.FADE_OUT);
    Animation.start(this.transparentOverlay_, Animation.Preset.FADE_OUT).then(goog.bind(function() {
      this.hide(true);
    }, this));
  }

  // Determine button state.
  if (nextStage > 0 && nextStage < this.explanations_.length) {
    goog.style.setElementShown(this.prevButton_, true);
    Animation.start(this.prevButton_, Animation.Preset.FADE_IN);
  } else {
    Animation.start(this.prevButton_, Animation.Preset.FADE_OUT).then(Animation.hideElement);
  }

  if (nextStage >= 0 && nextStage < this.explanations_.length - 1) {
    goog.style.setElementShown(this.nextButton_, true);
    Animation.start(this.nextButton_, Animation.Preset.FADE_IN);
  } else {
    Animation.start(this.nextButton_, Animation.Preset.FADE_OUT).then(Animation.hideElement);
  }

  if (nextStage == this.explanations_.length - 1) {
    goog.style.setElementShown(this.rightExitButton_, true);
    Animation.start(this.rightExitButton_, Animation.Preset.FADE_IN);
  } else {
    Animation.start(this.rightExitButton_, Animation.Preset.FADE_OUT).then(Animation.hideElement);
  }
};


/**
 * @override
 */
TourView.prototype.hide = function(opt_preventAnimation) {
  goog.base(this, 'hide', opt_preventAnimation);

  goog.style.setStyle(document.body, {
    'overflow': 'inherit'
  });

  if (opt_preventAnimation) {
    goog.style.setElementShown(this.getElement(), false);
    goog.dom.removeNode(this.transparentOverlay_);
  } else {
    this.stage_ = -1;
    this.renderStage_();
  }
};


/**
 * @override
 */
TourView.prototype.relayout = function(opt_preventAnimation) {
  goog.base(this, 'relayout', opt_preventAnimation);
};

});  // goog.scope
