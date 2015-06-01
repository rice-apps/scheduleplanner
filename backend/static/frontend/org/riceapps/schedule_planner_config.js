/**
 * Provides constants that can be used to enable or disable features of the application.
 */

goog.provide('org.riceapps.SchedulePlannerConfig');

goog.scope(function() {
var SchedulePlannerConfig = org.riceapps.SchedulePlannerConfig;


/**
 * Whether or not the TourView should be shown to new users.
 * @const {boolean}
 */
SchedulePlannerConfig.ENABLE_TOURS = false;


/**
 * Whether or not to use ESTHER to display course evaluations.
 * @const {boolean}
 */
SchedulePlannerConfig.USE_ESTHER_EVALUATIONS = true;

});  // goog.scope
