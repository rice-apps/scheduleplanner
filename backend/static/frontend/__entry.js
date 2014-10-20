/**
 * Provides the main entry point for the closure program when compiled.
 * @author mschurr@rice.edu (Matthew Schurr)
 */

goog.provide('__closureEntryPoint');

goog.require('org.riceapps.controllers.SchedulePlannerController');

/** @type {!org.riceapps.controllers.SchedulePlannerController} */
__closureEntryPoint.main = new org.riceapps.controllers.SchedulePlannerController();
__closureEntryPoint.main.start();
