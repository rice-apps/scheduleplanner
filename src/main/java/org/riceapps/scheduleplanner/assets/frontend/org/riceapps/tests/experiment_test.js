/**
 * Provides an environment in which to test org.riceapps.fx.Animation.
 * NOTE: You can run the test by viewing animation_test.html after building deps.js by running build_dev.sh.
 */

goog.provide('org.riceapps.tests.ExperimentTest');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.style');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Select');
goog.require('org.riceapps.controllers.Controller');
goog.require('org.riceapps.controllers.SchedulePlannerXhrController');
goog.require('org.riceapps.models.CourseModel');
goog.require('org.riceapps.models.CoursesModel');
goog.require('org.riceapps.util.CourseScheduleMatrix');

goog.scope(function() {



/**
 * @extends {org.riceapps.controllers.Controller}
 * @constructor
 */
org.riceapps.tests.ExperimentTest = function() {
  goog.base(this);
};
goog.inherits(org.riceapps.tests.ExperimentTest,
              org.riceapps.controllers.Controller);
var ExperimentTest = org.riceapps.tests.ExperimentTest;


/**
 * Runs the test.
 */
ExperimentTest.prototype.start = function() {
  window.console.log('ExperimentTest.start');

  var cb = new goog.ui.ComboBox();
  cb.setUseDropdownArrow(true);
  cb.setDefaultText('Select Folder...');

  /*var caption = new goog.ui.ComboBoxItem('Select folder...');
  caption.setSticky(true);
  caption.setEnabled(false);
  cb.addItem(caption);*/

  cb.addItem(new goog.ui.ComboBoxItem('Inbox'));
  cb.addItem(new goog.ui.ComboBoxItem('Bills & statements'));
  cb.addItem(new goog.ui.ComboBoxItem('Cal alumni'));
  cb.addItem(new goog.ui.ComboBoxItem('Calendar Stuff'));
  cb.addItem(new goog.ui.ComboBoxItem('Design'));
  cb.addItem(new goog.ui.ComboBoxItem('Music'));
  cb.addItem(new goog.ui.ComboBoxItem('Netflix'));
  cb.addItem(new goog.ui.ComboBoxItem('Personal'));
  cb.addItem(new goog.ui.ComboBoxItem('Photos'));
  cb.addItem(new goog.ui.ComboBoxItem('Programming languages'));
  /*cb.addItem(new goog.ui.MenuSeparator());*/

  /*var newfolder = new goog.ui.ComboBoxItem('New Folder...');
  newfolder.setSticky(true);
  cb.addItem(newfolder);*/

  cb.render(document.body);
};

});  // goog.scope
