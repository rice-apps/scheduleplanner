/**
 * Provides constants which include the current version of the application and a change log between application versions.
 *
 * Used to define the messages that appear in the pop-up changelog shown to users (org.riceapps.views.VersionInterruptView) when they
 * visit the application.
 */

goog.provide('org.riceapps.SchedulePlannerVersion');

goog.scope(function() {
var SchedulePlannerVersion = org.riceapps.SchedulePlannerVersion;


/**
 * The current version of the application.
 * @const {number}
 */
SchedulePlannerVersion.CURRENT_VERSION = 6;

/**
 * A list of changes associated with each version of the application.
 * The index into the array is the application version.
 * @const {!Array.<!Array.<string>>}
 */
SchedulePlannerVersion.MESSAGES = [
  [], // UNUSED
  [ // Version 1
    'Performance Improvement: searching should be more responsive.',
    'Drag and drop should work on mobile devices.'
  ],
  [ // Version 2
    'Dynamic Calendar Extension: courses can now be placed on Satudays and Sundays.',
    'Independent study courses can now be placed on the calendar.'
  ],
  [ // Version 3
    'Added list view of courses underneath calendar.'
  ],
  [ // Version 4
    'Added the "hide full" and "hide conflicts" search filters.'
  ],
  [ // Version 5
    'Added context menus to all courses.'
  ],
  [ // Version 6
    'Fixed a synchronization issue when multiple copies of the application are open.',
    'Users will now be shown a list of changes every time they visit the application.'
  ]
];

});  // goog.scope
