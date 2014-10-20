<?php

import('CourseDataParser');

/**
 * Pulls data from the course xml feed and updates the database.
 * This should probably be run periodically as a cron job.
 * php server.php refresh <year> <term>
 */
CLIApplication::listen('refresh', function($args){
	if(count($args) < 3) {
		fprintf(STDOUT, "Usage: refresh <year> <term>\n");
		return;
	}

	fprintf(STDOUT, "Refreshing course database...\n");
	$cdp = new CourseDataParser(App::getDatabase(), $args[1], $args[2]);
	$cdp->run();
	fprintf(STDOUT, "Done!\n");
});


/**
 * Assembles the application for development or production.
 */
CLIApplication::listen('build', function($args) {
  // Build the production or development front-end bundle.

  // Copy any assets into the static folder.
  foreach(File::open('../frontend')->descendants as $file) {
    if ($file->type == 'css' || $file->isImage) {
      //$file->copyTo();
    }
  }
});
