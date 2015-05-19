<?php

import('CLIUtilities');
import('CLIController');

CLIApplication::listen('prompt', 'CLIQueryController');

import('CourseDataParser');
import('ProtocolMessage');
import('SchedulePlannerProtocolMessages');


/**
 * Resets the database.
 * php server.php reset
 */
CLIApplication::listen('reset', function($args) {
  $db = App::getDatabase();
  $db->query("DELETE FROM `playgrounds`;");
  $db->query("DELETE FROM `schedules`;");
  $db->query("DELETE FROM `instructors`;");
  $db->query("DELETE FROM `courses`;");
  $db->query("DELETE FROM `course_restrictions`;");
  $db->query("DELETE FROM `course_times`;");
  $db->query("DELETE FROM `course_instructors`;");
  printf("OK\n");
});


/**
 * Executes an SQL file.
 * php server.php import file.sql
 */
CLIApplication::listen('import', function($args) {
  $file = File::open($args[1]);

  if (!$file->exists) {
    fprintf(STDERR, "File not found.\n");
    return 0;
  }

  if (!$file->isReadable) {
    fprintf(STDERR, "File not readable.\n");
    return 0;
  }

  import('SQLImport');
  SQLImport::import($file);
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

    $utility = new SchedulePlannerProtocolMessageUtility(App::getDatabase());
    $response = $utility->createCoursesResponse(null);
    $json = ProtocolMessage::serialize($response);

    try {
      $file = new File(FILE_ROOT.'/cache/courses.json');
      $file->content = "')]}\n".$json;
    } catch (FileException $e) {
      fprintf(STDOUT, "Failed to write file cache, continuing.\n");
    }

    fprintf(STDOUT, "Done!\n");
  } else {
    fprintf(STDOUT, "Unrecognized command.\n");
  }
});

/**
 * Regenerates the cache of course data to reflect database modifications.
 * php server.php recache
 */
CLIApplication::listen('recache', function($args) {
  $utility = new SchedulePlannerProtocolMessageUtility(App::getDatabase());
  $response = $utility->createCoursesResponse(null);
  $json = ProtocolMessage::serialize($response);

  try {
    $file = new File(FILE_ROOT.'/cache/courses.json');
    $file->content = "')]}\n".$json;
  } catch (FileException $e) {
    fprintf(STDOUT, "Failed to write file cache, continuing.\n");
  }
  fprintf(STDOUT, "Done!\n");
});
