<?php
/**
 * Interacts with the Rice University Courses XML feed and parses the information into the database.
 * This script is safe to run over and over again (so long as only one copy is running at a time).
 */

ini_set('memory_limit','200M');
ini_set('max_execution_time','300');
ini_set('max_input_time','300');

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
    'Unknown' => 0,
		'CoursePrerequisite' => 1,
		'CourseCorequisite' => 2,
		'InstructorPermission' => 3,
		'RegistrarPermission' => 4,
		'Major' => 5,
		'Program' => 6,
		'Classification' => 7,
		'Level' => 8
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

  public static $_XML_TO_DB_TERMS = array(
    "10" => 0,
    "20" => 1,
    "30" => 2
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

  /**
   *
   */
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

  /**
   * Returns the HTTP endpoint that should be queried for course data for the provided year and term.
   */
	public /*string*/ function getEndpoint() {
		return sprintf(static::$ENDPOINT, $this->year, $this->term);
	}

  public /*mixed*/ function array_get(/*array|ArrayAccess*/ $array, /*scalar*/ $key, /*mixed*/ $default) {
    if (isset($array[$key])) {
      return $array[$key];
    }

    return $default;
  }

  /**
   * Imports courses from courses.rice.edu.
   */
	public /*void*/ function run() {
		// Determine the endpoint URL.
		$url = $this->getEndpoint();

		// Query the server.
		$this->log("GET ".$url." HTTP/1.1");
		$xhttp = new xHTTPClient();
		$response = $xhttp->get($url);

		if(!$response || $response->status != '200')
			throw new CourseDataParserException("Failed to load courses from remote server.");

		$xml = $response->body;//*/
    //File::open("./test2.xml")->content = $xml;
		//$xml = File::open("./test2.xml")->content;

		$this->log('Finished loading feed.');

		// Parse the XML feed.
		$this->log("Parsing XML...");
		$data = null;

		try {
			$data = new SimpleXMLElement($xml);
		} catch (Exception $e) {
      $this->log("Failed to parse XML!");
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

  /**
   * Processes XML data into the database.
   */
	protected /*void*/ function run_database() {
		$this->log('Writing changes to database...');

		$this->db->query("SET NAMES utf8;");
		$this->db->query("SET CHARACTER SET utf8;");
		$this->db->query("SET character_set_connection = utf8;");

		for($i = 0; $i < count($this->courses); $i++) {
			if($i % 25 == 0) {
				$this->log(sprintf("%4d / %4d (%2f percent)", $i + 1, count($this->courses), ($i + 1) / count($this->courses) * 100));
			}

      $course = $this->courses[$i];

      /*
      UNUSED COURSE KEYS:
        session
      */

      $course_data = array(
        //'courseid' => 0,
        //'college' => '',
        //'course_url' => '',
        //'session_type' => '',
        //'grade_type' => '',
        'title' => $course['title'],
        'crn' => $course['crn'],
        'description' => $this->array_get($course, 'description', ''),
        'link' => $course['xlink_course'],
        'subject' => $course['subject'],
        'course_number' => $course['course_number'],
        'department' => $course['department'],
        'school' => $course['school'],
        'section' => $course['section'],
        'enrollment' => $course['actual_enrollment'],
        'max_enrollment' => $course['max_enrollment'],
        'last_update' => time(),
        'waitlisted' => $course['xlst_wait_count'],
        'xlist_waitlisted' => $course['xlst_wait_count'],
        'max_waitlisted' => $course['xlst_wait_capacity'],
        'xlist_max_waitlisted' => $course['xlst_wait_capacity'],
        'xlist_enrollment' => $this->array_get($course, 'xlst_actual_enrollment', 0),
        'xlist_max_enrollment' => $this->array_get($course, 'xlst_max_enrollment', 0),
        'year' => $this->year,
        'term' => CourseDataParserEnum::$_XML_TO_DB_TERMS[$this->term],
        'credit_lpap' => ($course['subject'] === 'LPAP'),
        'xlist_group' => $this->array_get($course, 'xlst_group', '')
      );

      // Parse credit hours.
      if (str_contains($course['credit_hours'], ' TO' )) {
        $credits = explode(' TO ', $course['credit_hours']);
        $course_data['credit_hours'] = (int) $credits[0];
        $course_data['credit_hours_min'] = (int) $credits[0];
        $course_data['credit_hours_max'] = (int) $credits[1];
      } else {
        $course_data['credit_hours'] = (int) $course['credit_hours'];
        $course_data['credit_hours_min'] = (int) $course['credit_hours'];
        $course_data['credit_hours_max'] = (int) $course['credit_hours'];
      }

      // Parse distribution group.
      if (isset($course['distribution_group'])) {
        if ($course['distribution_group'] === 'Distribution Group I') {
          $course_data['credit_distribution'] = 1;
        } else if ($course['distribution_group'] === 'Distribution Group II') {
          $course_data['credit_distribution'] = 2;
        } else if ($course['distribution_group'] === 'Distribution Group III') {
          $course_data['credit_distribution'] = 3;
        } else {
          $course_data['credit_distribution'] = 0;
        }
      }

      // Determine the the course already exists in the database.
      $q = $this->db->prepare("SELECT * FROM `courses` WHERE `year` = ? AND `term` = ? AND `crn` = ? LIMIT 1;")
         ->execute([$this->year, CourseDataParserEnum::$_XML_TO_DB_TERMS[$this->term], $course['crn']]);

      if ($q->size > 0) {
        $course_data['courseid'] = $q->row['courseid'];
      }

      $course_data['courseid'] = $this->exec('courses', $course_data);

      // Parse times.
      $this->parse_times($course_data['courseid'], $course);

      // Parse instructors.
      $instructorids = $this->parse_instructors($course);
      $this->parse_course_instructors($course_data['courseid'], $instructorids);
      $this->parse_course_restrictions($course_data['courseid'], $course);
		}
	}

  /**
   * Parses the instructors from a course, inserts them into the database, and returns their ids.
   */
	protected /*array<int>*/ function parse_instructors(/*array<string,string>*/ $course) {
    if (!isset($course['instructor'])) {
      return [];
    }

    $instructors = explode("; ", $course['instructor']);
    $insructorids = [];

    foreach($instructors as $instructor) {
      $q = $this->db->prepare("SELECT * FROM `instructors` WHERE `name` = ? LIMIT 1;")->execute([$instructor]);

      if ($q->size > 0) {
        $instructorids[] = $q->row['instructorid'];
      } else {
        $instructorids[] = $this->exec('instructors', array(
          'name' => $instructor
        ));
      }
    }

    return $instructorids;
	}

  /**
   * Adds the instructors for a given course into the database.
   */
	protected /*void*/ function parse_course_instructors(/*int*/ $courseid, /*array<int>*/ $instructorids) {
    $this->db->prepare("DELETE FROM `course_instructors` WHERE `courseid` = ?;")->execute([$courseid]);

    foreach($instructorids as $instructorid) {
      $this->exec('course_instructors', array(
        'courseid' => $courseid,
        'instructorid' => $instructorid
      ));
    }
	}

  /**
   * Converts military time to an offset of minutes from the start of the day.
   */
  protected /*int*/ function parse_military_to_minutes(/*int|string*/ $time) {
    $time = strval($time);
    $minutes = (int) substr($time, -2);
    $hours = (strlen($time) > 2 ? (int) substr($time, 0, -2) : 0);
    $minutes += 60 * $hours;
    return $minutes;
  }

  /**
   * Parses the times and locations associated with a course and inserts them into the database.
   */
	protected /*void*/ function parse_times(/*int*/ $courseid, /*array<string,string>*/ $course) {
    if (!isset($course['start_time'])) {
      return;
    }

    $this->db->prepare("DELETE FROM `course_times` WHERE `courseid` = ?;")->execute($courseid);

    $start_times = explode(', ', $course['start_time']);
    $end_times = explode(', ', $course['end_time']);
    $locations = explode(', ', $course['location']);

    if (!isset($course['meeting_days'])) {
      $meeting_days = [];

      for ($i = 0; $i < count($start_times); $i++) {
        $meeting_days[] = 'MWF'; // Defaults to MWF
      }
    } else {
      $meeting_days = explode(', ', $course['meeting_days']);
    }

    for ($i = 0; $i < count($start_times); $i++) {
      $days = strlen($meeting_days[$i]);

      if ($i >= count($locations)) {
        $location = $locations[0];
      } else {
        $location = $locations[$i];
      }

      $split = strpos($location, " ");
      $building_code = '';
      $room_number = '';

      if ($split !== false) {
        $building_code = substr($location, 0, $split);
        $room_number = substr($location, $split + 1);
      }

      for ($j = 0; $j < $days; $j++) {
        $time_data = array(
          'courseid' => $courseid,
          'time_start' => $this->parse_military_to_minutes($start_times[$i]),
          'time_end' => $this->parse_military_to_minutes($end_times[$i]),
          'day' => CourseDataParserEnum::$_XML_TO_DB_DAYS[substr($meeting_days[$i], $j, 1)],
          'building_code' => $building_code,
          'room_number' => $room_number,
          'frequency' => 1,
          'offset' => 0,
          'limit' => 0
        );

        $this->exec('course_times', $time_data);
      }
    }
	}


  /*
  Formatting of restrictions:
  catalog_inst_permission
    Instructor permission required
    Department permission required
  level_restrictions
    Must be enrolled in one of the following Level(s):Undergraduate.
    Must be enrolled in one of the following Level(s):Graduate.
    May not be enrolled in any of the following Level(s):Undergraduate.
    May not be enrolled in any of the following Level(s):Graduate.
  catalog_or_permission
    "or permission of instructor"
    "or permission of department"
  class_restrictions
    ["May not be in any of the following Classification(s):Freshman,Sophomore."]=>
    ["May not be in any of the following Classification(s):Freshman,Junior,Sophomore,Senior."]=>
    ["Must be in one of the following Classification(s):Graduate."]=>
    ["May not be in any of the following Classification(s):Graduate."]=>
    ["May not be in any of the following Classification(s):Junior,Senior."]=>
    ["May not be in any of the following Classification(s):Freshman."]=>
    ["Must be in one of the following Classification(s):Junior,Senior."]=>
    ["Must be in one of the following Classification(s):Senior."]=>
    ["Must be in one of the following Classification(s):Freshman,Junior,Sophomore,Senior."]=>
  program_restrictions
    ["Must be enrolled in one of the following Program(s):Doctor of Philosophy Business."]
    ["Must be enrolled in one of the following Program(s):MBA."]
    ["Must be enrolled in one of the following Program(s):MBA,MBA for Professionals."]
    ["Must be enrolled in one of the following Program(s):MBA - Executive Program."]
    ["May not be enrolled in any of the following Program(s):MBA - Executive Program."]
  major_restrictions
    ["Must be enrolled in one of the following Major(s): Managerial Studies."]
    ["Must be enrolled in one of the following Major(s): Philosophy."]
    ["Must be enrolled in one of the following Major(s): Cognitive Sciences,Psychology."]
    ["Must be enrolled in one of the following Major(s): Mechanical Engineering."]
    ["Must be enrolled in one of the following Major(s): Psychology."]
    ["Must be enrolled in one of the following Major(s): Astronomy,Astrophysics,Chemical Physics,Physics."]
    ["Must be enrolled in one of the following Major(s): Music Division,Music."]
    ["Must be enrolled in one of the following Major(s): Music."]
    ["May not be enrolled in any of the following Major(s): Music."]
    ["Must be enrolled in one of the following Major(s): Visual and Dramatic Arts."]
    ["Must be enrolled in one of the following Major(s): Biochemistry and Cell Biology."]
    ["Must be enrolled in one of the following Major(s): Statistics."]
    ["Must be enrolled in one of the following Major(s): Systems/Synthetic/Phys Biology."]
    ["Must be enrolled in one of the following Major(s): Liberal Studies."]
  pre_requisites
    ["DEPT ###"] operators: (), OR, AND
  co_requisites
    same as pre_requisites
  */

  /**
   * Parses restrictions for the provided course into the course_restrictions table.
   */
	protected /*void*/ function parse_course_restrictions(/*int*/ $courseid, /*array<string:string>*/ $course) {
    // There's a lot of ugly regex parsing that needs to be done to make sensible structure out
    // of this data... for now, do naive parse where we only care about the descriptions, as that
    // is all that must be displayed within schedule planner.
    $restrictions = [];

    if (isset($course['catalog_inst_permission'])) {
      $restriction = $course['catalog_inst_permission'];

      if (isset($course['catalog_or_permission'])) {
        $restriction .= $course['catalog_or_permission'];
      }

      $restrictions[] = $restriction;
    }

    if (isset($course['level_restrictions'])) {
      $restrictions[] = $course['level_restrictions'];
    }

    if (isset($course['class_restrictions'])) {
      $restrictions[] = $course['class_restrictions'];
    }

    if (isset($course['program_restrictions'])) {
      $restrictions[] = $course['program_restrictions'];
    }

    if (isset($course['major_restrictions'])) {
      $restrictions[] = $course['major_restrictions'];
    }

    if (isset($course['pre_requisites'])) {
      $restrictions[] = 'Must have taken the following courses: '.$course['pre_requisites'];
    }

    if (isset($course['co_requisites'])) {
      $restrictions[] = 'Must have taken or be enrolled in the following courses: '.$course['co_requisites'];
    }

    $this->db->prepare("DELETE FROM `course_restrictions` WHERE `courseid` = ?;")->execute($courseid);

    foreach ($restrictions as $r) {
      $this->exec('course_restrictions', array(
        'courseid' => $courseid,
        'restriction_type' => 0,
        'target' => 0,
        'target_subject' => '',
        'target_course_number' => '',
        'description' => $r
      ));
    }
	}

  /**
   * Executes an SQL replace-into query with the provided array mapping columns to values.
   * Returns the value of the primary key at which the value was inserted.
   */
	protected /*int*/ function exec(/*string*/ $table, /*array<string:mixed>*/ $data) {
		$stmt = $this->db->prepare("REPLACE INTO `".$table."` (".sql_keys($data).") VALUES (".sql_values($data).");");
		$res = $stmt->execute(sql_parameters($data));
    return $res->insertId;
	}

  /**
   * Logs a message to STDERR.
   */
	public /*void*/ function log(/*string*/ $message) {
		fprintf(STDERR, $message."\n");
	}

  /**
   * Cleans up the object before garbage collection.
   */
	public /*void*/ function __destruct() {
    unset($this->db);
  }

  /**
   * Returns the current university year (based on the current date).
   */
  public static /*int*/ function getCurrentYear() {
      $term = static::getCurrentTerm();

      if ($term == 'Fall') {
        return ((int) date('Y')) + 1; // ...Apparently courses.rice.edu needs this.
      }
      return (int) date('Y');
  }

  /**
   * Returns the current university term (based on the current date).
   */
  public static /*string*/ function getCurrentTerm() {
    $month = (int) date('n');

    if($month <= 4)
      return 'Spring';
    if($month <= 7)
      return 'Summer';

    return 'Fall';
  }
}
