goog.provide('org.riceapps.SchedulePlannerVersion');

goog.scope(function() {
var SchedulePlannerVersion = org.riceapps.SchedulePlannerVersion;


/**
 * @const {number}
 */
SchedulePlannerVersion.CURRENT_VERSION = 6;

/**
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
