<?php
/**
 * Interacts with the Rice University Courses XML feed and parses the information into the database.
 * This script is safe to run over and over again (so long as only one copy is running at a time).
 */

class CourseDataParserException extends Exception {}

class CourseDataParserEnum {
	public static $DAY = array(
		'Sunday' => 0,
		'Monday' => 1,
		'Tuesday' => 2,
		'Wednesday' => 3,
		'Thursday' => 4,
		'Friday' => 5,
		'Saturday' => 6
	);

	public static $RESTRICTION_TYPE = array(
		'CoursePrerequisite' => 0,
		'CourseCorequisite' => 1,
		'InstructorPermission' => 2,
		'RegistrarPermission' => 3,
		'Major' => 4,
		'Program' => 5,
		'Classification' => 6,
		'Level' => 7
	);

	public static $TERM = array(
		'FallTerm' => 0,
		'SpringTerm' => 1,
		'SummerTerm' => 2
	);

	public static $COLLEGE = array(
		'Baker' => 0,
		'Duncan' => 1,
		'McMurtry' => 2,
		'Martel' => 3,
		'Jones' => 4,
		'Brown' => 5,
		'Wiess' => 6,
		'SidRichardson' => 7,
		'Hanszen' => 8,
		'Lovett' => 9,
		'WillRice' => 10
	);

	public static $GRADE_TYPE = array(
		'StandardLetter' => 0,
		'PassFail' => 1
	);

	public static $_XML_TO_DB_DAYS = array(
		'U' => 0,
		'M' => 1,
		'T' => 2,
		'W' => 3,
		'R' => 4,
		'F' => 5,
		'S' => 6
	);
}

class CourseDataParser {
	public static $ENDPOINT = 'http://courses.rice.edu/admweb/!SWKSECX.main?term=%s%s&title=&course=&crn=&coll=&dept=&subj=';
	public static $TERMS = array(
		"Fall" => "10",
		"Spring" => "20",
		"Summer" => "30"
	);
	public static $TERMLIST = ["10", "20", "30"];
	const FallTerm = "10";
	const SpringTerm = "20";
	const SummerTerm = "30";

	protected /*Database*/ $db = null;
	protected /*int*/ $year;
	protected /*string*/ $term;
	protected /*array*/ $keys;
	protected /*array<array<string,string>>*/ $courses;

	public /*void*/ function __construct(Database $db, /*int*/ $year, /*string*/ $term) {
		if(!is_integer($year) && !ctype_digit($year)) {
			throw new CourseDataParserException("Invalid year.");
		}

		if(isset(static::$TERMS[$term])) {
			$this->term = static::$TERMS[$term];
		} else if(in_array((string)$term, static::$TERMLIST)) {
			$this->term = $term;
		} else {
			throw new CourseDataParserException("Invalid term.");
		}

		$this->db = $db;
		$this->year = $year;
	}

	public /*string*/ function getEndpoint() {
		return sprintf(static::$ENDPOINT, $this->year, $this->term);
	}

	public /*void*/ function run() {
		// Determine the endpoint URL.
		$url = $this->getEndpoint();

		// Query the server.
		/*$this->log("HTTP/1.1 GET ".$url);
		$xhttp = new xHTTPClient();
		$response = $xhttp->get($url);

		if(!$response || $response->status != '200')
			throw new CourseDataParserException("Failed to load courses from remote server.");

		$xml = $response->body;*/
		$xml = File::open("/home/ectrian/Dropbox/github/scheduleplanner/database/data201420.xml")->content;

		$this->log('Finished loading feed.');

		// Parse the XML feed.
		$this->log("Parsing XML...");
		$data = null;

		try {
			$data = new SimpleXMLElement($xml);
		} catch (Exception $e) {
			throw new CourseDataParserException($e);
		}

		// Move data into a native structure.
		$this->keys = [];
		$this->courses = array();

		foreach($data as $element) {
			$course = array();

			foreach($element as $key => $value) {
				$key = str_replace("-", "_", $key);
				$course[$key] = (string)$value;
				$this->keys[] = $key;
			}

			$this->keys = array_unique($this->keys);
			$this->courses[] = $course;
		}

		$this->log("Parsed ".count($this->courses)." courses with ".count($this->keys)." keys.");

		unset($xml);
		unset($data);

		// Translate the courses into the database.
		$this->run_database();
	}

	protected /*void*/ function run_database() {
		$this->log('Writing changes to database...');

		$this->db->query("SET NAMES utf8;");
		$this->db->query("SET CHARACTER SET utf8;");
		$this->db->query("SET character_set_connection=utf8;");

		for($i = 0; $i < count($this->courses); $i++) {
			if($i % 200 == 0) {
				$this->log(sprintf("%d / %d (%2f)", $i + 1, count($this->courses), ($i + 1) / count($this->courses) * 100));
			}

			$course = $this->courses[$i];

			// Parse instructors.

			// Parse course.

			// Parse course_instructors.

			// Parse course_times.

			// Parse course_restrictions.
		}
	}

	protected /*void*/ function parse_instructors($course) {
		/*$this->exec('instructors', array(
			'instructorid' => '',
			'name' => ''
		));*/
	}

	protected /*int*/ function parse_course($course) {

	}

	protected /*void*/ function parse_course_instructors($courseid, $course) {
		/*$this->exec('course_instructors', array(
			'courseid' => $courseid,
			'instructorid' => null
		));*/
	}

	protected /*void*/ function parse_course_times($course) {

	}

	protected /*void*/ function parse_course_restrictions($course) {

	}


	protected /*void*/ function exec($table, $data) {
		$stmt = $this->db->prepare("REPLACE INTO `".$table."` (".sql_keys($data).") VALUES (".sql_values($data).");");
		$stmt->execute(sql_parameters($data));
	}

	public /*void*/ function log($message) {
		fprintf(STDERR, $message."\n");
	}

	public /*void*/ function __destruct() {

	}
}



/*

CREATE TABLE `courses` (
  `courseid` int(64) UNSIGNED NOT NULL auto_increment,
  `year` int(64) UNSIGNED NOT NULL,
  `term` int(32) UNSIGNED NOT NULL,
  `title` varchar(128) NOT NULL,
  `subject` varchar(4) NOT NULL, /* Subject (e.g. COMP)
  `course_number` int(16) UNSIGNED NOT NULL, /* 3-Digit Course Number
  `college` int(16) UNSIGNED NULL,
  `crn` int(64) UNSIGNED NOT NULL,
  `last_update` int(64) UNSIGNED NOT NULL, /* UNIX Timestamp
  `course_url` varchar(255) NULL,
  `link` varchar(255) NULL, /* Link to page on courses.rice.edu
  `description` mediumtext NULL,
  `enrollment` int(32) UNSIGNED NULL,
  `waitlisted` int(32) UNSIGNED NULL,
  `max_enrollment` int(32) UNSIGNED NULL,
  `max_waitlisted` int(32) UNSIGNED NULL,
  `xlist_enrollment` int(32) UNSIGNED NULL,
  `xlist_waitlisted` int(32) UNSIGNED NULL,
  `xlist_max_enrollment` int(32) UNSIGNED NULL,
  `xlist_max_waitlisted` int(32) UNSIGNED NULL,
  `credit_lpap` boolean NOT NULL DEFAULT 0,
  `credit_distribution` int(32) UNSIGNED NULL,
  `department` varchar(128) NOT NULL, /* e.g. Computer Science
  `school` varchar(128) NOT NULL, /* e.g. Engineering, Humanities...
  `section` int(32) UNSIGNED NULL,
  `credit_hours` int(32) UNSIGNED NOT NULL,
  `credit_hours_min` int(32) UNSIGNED NULL,
  `credit_hours_max` int(32) UNSIGNED NULL,
  `session_type` int(32) UNSIGNED NOT NULL, /* see courses.rice.edu
  `xlist_group` varchar(32) NULL,
  `grade_type` int(32) UNSIGNED NOT NULL,
  PRIMARY KEY  (`courseid`)
);



CREATE TABLE `course_times` (
  `courseid` int(64) UNSIGNED NOT NULL,
  `time_start` int(64) UNSIGNED NOT NULL, # minutes from 00:00
  `day` int(64) UNSIGNED NOT NULL,
  `time_end` int(64) UNSIGNED NOT NULL, # minutes from 00:00
  `building_code` varchar(16) NULL,
  `room_number` varchar(16) NULL,
  `frequency` int(32) UNSIGNED NOT NULL DEFAULT 1,
  `offset` int(32) UNSIGNED NOT NULL DEFAULT 0,
  `limit` int(32) UNSIGNED NOT NULL DEFAULT 0
);


CREATE TABLE `course_restrictions` (
  `courseid` int(64) UNSIGNED NOT NULL,
  `restriction_type` int(32) UNSIGNED NOT NULL,
  `target` int(64) UNSIGNED NOT NULL,
  `target_subject` varchar(4) NOT NULL,
  `target_course_number` int(16) UNSIGNED NOT NULL,
  `description` varchar(128) NOT NULL DEFAULT ''
);
*/
