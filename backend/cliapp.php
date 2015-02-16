<?php

import('CLIUtilities');
import('CLIController');

CLIApplication::listen('prompt', 'CLIQueryController');


import('CourseDataParser');


/**
 * Resets the database.
 */
CLIApplication::listen('reset', function($args) {
  $db = App::getDatabase();
  $db->query("DELETE FROM `playergrounds`;");
  $db->query("DELETE FROM `schedules`;");
  $db->query("DELETE FROM `instructors`;");
  $db->query("DELETE FROM `courses`;");
  $db->query("DELETE FROM `course_restrictions`;");
  $db->query("DELETE FROM `course_times`;");
  $db->query("DELETE FROM `course_instructors`;");
  printf("OK\n");
});

/**
 * Pulls data from the course xml feed and updates the database.
 * This should probably be run periodically as a cron job.
 * php server.php courses <command> <year> <term>
 */
CLIApplication::listen('courses', function($args) {
	if(count($args) < 2) {
    fprintf(STDOUT, "Usage: courses <command> [<year> [<term>]]\n");
		fprintf(STDOUT, "  Commands: pull - refreshes the course database from the Rice servers\n");
		return;
	}

  if ($args[1] == 'pull') {
    fprintf(STDOUT, "Refreshing course database...\n");

    $year = CourseDataParser::getCurrentYear();
    if (isset($args[2])) {
      $year = (int) $args[2];
    }

    $term = CourseDataParser::getCurrentTerm();
    if (isset($args[3])) {
      $term = $args[3];
    }

    $cdp = new CourseDataParser(App::getDatabase(), $year, $term);
    $cdp->run();
    fprintf(STDOUT, "Done!\n");
  } else {
    fprintf(STDOUT, "Unrecognized command.\n");
  }
});
