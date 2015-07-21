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
SchedulePlannerVersion.CURRENT_VERSION = 13;

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
  ],
  [ // Version 7
    'Unauthenticated users can now use the application.'
  ],
  [ // Version 8
    'Fixed a bug in which search results were not always scrollable with the mouse wheel.'
  ],
  [ // Version 9
    'Fixed a bug in which search filters were not visible on low resolution displays.'
  ],
  [ // Version 10
    'Added a search filter for independent study courses.',
    'Added a "View In Catalog" context menu option.',
    'Pressing escape in the search box now hides the search view.'
  ],
  [ // Version 11
    'Context menus now work in the list view.',
    'Click on a CRN in the list view to easily copy to your clipboard.'
  ],
  [ // Version 12
    'Visual overhaul and user experience improvements.'
  ],
  [ // Version 13
    'Added filters for department, school, and instructor.',
    'Added clarification tooltip on the hide conflicts filter.'
  ]
];

});  // goog.scope
