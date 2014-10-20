<?php
/*
  GET /api/user
    -> UserModelProtocolMessage
  POST /api/courses [CoursesRequestProtocolMessage]
    -> CoursesProtocolMessage
  POST /api/user [UserRequestProtocolMessage]
    -> UserResponseProtocolMessage
*/

/**
 * A request for the retrieval of courses from the database.
 */
class CoursesRequestProtocolMessage {
  public /*string*/  $xsrfToken;
  public /*int*/     $userId;
  public /*string*/  $keywords;
  public /*boolean*/ $showNonDistribution;
  public /*boolean*/ $showDistribution1;
  public /*boolean*/ $showDistribution2;
  public /*boolean*/ $showDistribution3;
  public /*boolean*/ $hideFull;
  public /*boolean*/ $hideConflicts;
  public /*int*/     $offset;
  public /*int*/     $limit;
  public /*int*/     $year;
  public /*int*/     $term;

  public function validate() {
    if ($this->keywords === null ||
        !is_string($this->keywords) ||
        strlen($this->keywords) == 0 ||
        strlen($this->keywords) > 255) {
      return false;
    }

    if (!is_string($this->xsrfToken) ||
        !is_integer($this->userId) ||
        $this->userId <= 0 ||
        strlen($this->xsrfToken) == 0 ||
        strlen($this->xsrfToken) > 255) {
      return false;
    }

    if (!is_bool($this->showNonDistribution) ||
        !is_bool($this->showDistribution3) ||
        !is_bool($this->showDistribution2) ||
        !is_bool($this->showDistribution1) ||
        !is_bool($this->hideFull) ||
        !is_bool($this->hideConflicts)) {
      return false;
    }

    if (!is_integer($this->offset) ||
        !is_integer($this->limit) ||
        !is_integer($this->year) ||
        !is_integer($this->term) ||
        $this->offset < 0 ||
        $this->year < 0 ||
        $this->limit < 0 ||
        $this->limit > 100) {
      return false;
    }

    return parent::validate();
  }
}

class UserRequestProtocolMessage extends ProtocolMessage {
  public /*int*/ $userId;
  public /*string*/ $xsrfToken;
  public /*boolean*/ $hasSeenTour;
  public /*PlaygroundProtocolMessage*/ $playground;
  public /*ScheduleProtocolMessage */ $schedule;
}

class UserModelProtocolMessage extends ProtocolMessage {
  public /*int*/ $userId;
  public /*string*/ $userName;
  public /*string*/ $xsrfToken;
  public /*boolean*/ $hasSeenTour;
  public /*PlaygroundProtocolMessage*/ $playground;
  public /*ScheduleProtocolMessage */ $schedule;

  public function __construct() {
    parent::__construct();
    $this->playground = new PlaygroundProtocolMessage;
    $this->schedule = new ScheduleProtocolMessage;
  }

  /** @override */
  public function validate() {
    return parent::validate() &&
           $this->userId !== null &&
           $this->userName !== null &&
           $this->xsrfToken !== null &&
           $this->hasSeenTour !== null &&
           $this->playground->validate() &&
           $this->schedule->validate() &&
           is_integer($this->userId);
  }
}

class PlaygroundProtocolMessage extends ProtocolMessage {
  public /*array<CourseModelProtocolMessage>*/ $courses;

  public function __construct() {
    parent::__construct();
    $this->courses = [];
  }

  /** @override */
  public function validate() {
    return parent::validate() && $this->courses !== null && is_array($this->courses);
  }
}

class CoursesProtocolMessage extends ProtocolMessage {
  public /*array<CourseModelProtocolMessage>*/ $courses;

  public function __construct() {
    parent::__construct();
    $this->courses = [];
  }

  /** @override */
  public function validate() {
    return parent::validate() && $this->courses !== null && is_array($this->courses);
  }
}

class ScheduleProtocolMessage extends ProtocolMessage {
  public /*array<CourseModelProtocolMessage>*/ $courses;

  public function __construct() {
    parent::__construct();
    $this->courses = [];
  }

  /** @override */
  public function validate() {
    return parent::validate() && $this->courses !== null && is_array($this->courses);
  }
}

class InstructorModelProtocolMessage extends ProtocolMessage {
  public /*int*/ $instructorId;
  public /*string*/ $instructorName;
}

class CourseModelMeetingTimeProtocolMessage {
  public /*int*/ $day;
  public /*double|int*/ $start;
  public /*double|int*/ $end;
  public /*int*/ $frequency;
  public /*int*/ $offset;
  public /*int*/ $limit;
  public /*string*/ $building;
  public /*string*/ $room;

  /** @override */
  public function validate() {
    return parent::validate() &&
           is_integer($this->day) && $this->day >= 0 && $this->day <= 6 &&
           is_integer($this->start) && $this->start >= 0 && $this->start <= 24 &&
           is_integer($this->end) && $this->end >= 0 && $this->end <= 24;
  }
}

class CourseModelRestrictionProtocolMessage extends ProtocolMessage {
  public /*int*/ $restrictionType;
  public /*int*/ $target;
  public /*string*/ $targetSubject;
  public /*int*/ $targetCourseNumber;
  public /*string*/ $description;
}

class CourseModelProtocolMessage extends ProtocolMessage {
  public /*int*/ $courseId;
  public /*array<CourseModelMeetingTimeProtocolMessage>*/ $meetingTimes;
  public /*array<CourseModelRestrictionProtocolMessage>*/ $restrictions;
  public /*array<InstructorModelProtocolMessage>*/ $instructors;
  public /*string*/ $title;
  public /*string*/ $subject;
  public /*int*/ $courseNumber;
  public /*int*/ $distributionGroup;
  public /*int*/ $term;
  public /*int*/ $year;
  public /*string*/ $college;
  public /*int*/ $crn;
  public /*int*/ $lastUpdate;
  public /*string*/ $courseUrl;
  public /*string*/ $link;
  public /*string*/ $description;
  public /*boolean*/ $creditLpap;
  public /*string*/ $department;
  public /*string*/ $school;
  public /*int*/ $section;
  public /*int*/ $creditHours;
  public /*int*/ $creditHoursMin;
  public /*int*/ $creditHoursMax;
  public /*int*/ $sessionType;
  public /*int*/ $gradeType;
  public /*string*/ $xlistGroup;
  public /*int*/ $xlistEnrollment;
  public /*int*/ $xlistWaitlisted;
  public /*int*/ $xlistMaxEnrollment;
  public /*int*/ $xlistMaxWaitlisted;
  public /*int*/ $maxEnrollment;
  public /*int*/ $maxWaitlisted;
  public /*int*/ $enrollment;
  public /*int*/ $waitlisted;

  public function __construct() {
    parent::__construct();
    $this->meetingTimes = new CourseModelMeetingTimeProtocolMessage;
    $this->instructors = [];
    $this->restrictions = [];
    $this->meetingTimes = [];
  }

  /** @override*/
  public function validate() {
    return parent::validate() && is_integer($this->courseId) && $this->courseId > 0;
  }
}

class SchedulePlannerProtocolMessageUtility {
  const XSRF_PROPERTY = '_xsrf';
  const TOUR_PROPERTY = 'tour';

  protected /*Database*/ $db;

  public /*void*/ function __construct(Database $db) {
    $this->db =& $db;
  }

  /**
   * Creates and returns a user model protocol message for the provided session. Assumes the session has an
   * authenticated user attached.
   */
  public /*UserModelProtocolMessage*/ function createUserModel(/*Session*/ $session) {
    $user = $session->auth->user;
    $hasSeenTour = $user->hasProperty(static::TOUR_PROPERTY)
        ? $user->getProperty(static::TOUR_PROPERTY) : false;

    $message = new UserModelProtocolMessage;
    $message->userId = (int) $user->id;
    $message->userName = $user->username;
    $message->xsrfToken = $this->createXsrfToken($session);
    $message->hasSeenTour = $hasSeenTour;
    $message->playground = $this->createPlayground($user);
    $message->schedule = $this->createSchedule($user);
    return $message;
  }

  /**
   * Creates and returns an XSRF token. XSRF tokens are session-specific, but are also stored to
   * the user account and must match the user account's version when checked.
   *
   * The purpose of the XSRF token is two-fold:
   *  - To prevent XSRF attacks
   *  - To prevent the user from having multiple copies of the app open at a time
   */
  public /*string*/ function createXsrfToken(/*Session*/ $session) {
    $user = $session->auth->user;
    $token = str_random(128);
    $session->set(static::XSRF_PROPERTY, $token);

    if ($user) {
      $user->setProperty(static::XSRF_PROPERTY, $token);
    }

    return $token;
  }

  /**
   * Returns whether or not the provided XSRF token is correct for the given session.
   */
  public /*string*/ function checkXsrfToken(/*Session*/ $session, /*string*/ $token) {
    if (!$session->auth->loggedIn) {
      return false;
    }

    $user = $session->auth->user;

    if (!$session->has(static::XSRF_PROPERTY)) {
      return false;
    }

    if (strcmp($session->get(static::XSRF_PROPERTY), $token) !== 0) {
      return false;
    }

    if (!$user->hasProperty(static::XSRF_PROPERTY)) {
      return false;
    }

    return strcmp($session->get(static::XSRF_PROPERTY), $user->getProperty(static::XSRF_PROPERTY)) === 0;
  }

  public /*PlaygroundProtocolMessage*/ function createPlayground(/*User_Provider*/ $user) {
    $stmt = $this->db->prepare("SELECT `courseid` FROM `playgrounds` WHERE `userid` = ?;");
    $query = $stmt->execute([$user->id]);

    $message = new PlaygroundProtocolMessage;

    if (count($query->rows) == 0) {
      return $message;
    }

    foreach ($query->rows as $row) {
      $message->courses[] = $this->createCourseModel($row['courseid']);
    }

    return $message;
  }

  public /*ScheduleProtocolMessage*/ function createSchedule(/*User_Provider*/ $user) {
    $stmt = $this->db->prepare("SELECT `courseid` FROM `schedules` WHERE `userid` = ?;");
    $query = $stmt->execute([$user->id]);

    $message = new ScheduleProtocolMessage;

    if (count($query->rows) == 0) {
      return $message;
    }

    foreach ($query->rows as $row) {
      $message->courses[] = $this->createCourseModel($row['courseid']);
    }

    return $message;
  }

  public /*array<CourseModelMeetingTimeProtocolMessage>*/ function createMeetingTimes($courseid) {
    $stmt = $this->db->prepare("SELECT * FROM `course_times` WHERE `courseid` = ?;");
    $query = $stmt->execute([$courseid]);

    $messages = [];

    foreach ($query->rows as $row) {
      $message = new CourseModelMeetingTimeProtocolMessage;
      $message->day = (int) $row['day'];
      $message->start = (int) $row['time_start'];
      $message->end = (int) $row['time_end'];
      $message->frequency = (int) $row['frequency'];
      $message->offset = (int) $row['offset'];
      $message->limit = (int) $row['limit'];
      $message->building = $row['building_code'];
      $message->room = $row['room_number'];
      $messages[] = $message;
    }

    return $messages;
  }

  public /*array<CourseModelRestrictionProtocolMessage>*/ function createRestrictions($courseid) {
    $stmt = $this->db->prepare("SELECT * FROM `course_restrictions` WHERE `courseid` = ?;");
    $query = $stmt->execute([$courseid]);

    $messages = [];

    foreach ($query as $row) {
      $message = new CourseModelRestrictionProtocolMessage;
      $message->restrictionType = (int) $row['restriction_type'];
      $message->target = (int) $row['target'];
      $message->targetSubject = $row['target_subject'];
      $message->targetCourseNumber = (int) $row['target_course_number'];
      $message->description = $row['description'];
      $messages[] = $message;
    }

    return $messages;
  }

  public /*array<InstructorModelProtocolMessage>*/ function createInstructors($courseid) {
    $stmt = $this->db->prepare("
      SELECT `instructors`.* FROM `course_instructors`
      JOIN `instructors` ON `instructors`.`instructorid` = `course_instructors`.`instructorid`
      WHERE `course_instructors`.`courseid` = ?;");
    $query = $stmt->execute([$courseid]);

    $messages = [];

    foreach ($query as $row) {
      $message = new InstructorModelProtocolMessage;
      $message->instructorId = (int) $row['instructorid'];
      $message->instructorName = $row['name'];
      $messages[] = $message;
    }

    return $messages;
  }

  public /*CourseModelProtocolMessage*/ function createCourseModel($courseid) {
    $stmt = $this->db->prepare("SELECT * FROM `courses` WHERE `courseid` = ? LIMIT 1;");
    $query = $stmt->execute([$courseid]);

    if (count($query->rows) == 0) {
      return null;
    }

    $message = new CourseModelProtocolMessage;

    $message->courseId = (int) $courseid;
    $message->meetingTimes = $this->createMeetingTimes($courseid);
    $message->restrictions = $this->createRestrictions($courseid);
    $message->instructors = $this->createInstructors($courseid);
    $message->title = $query->row['title'];
    $message->subject = $query->row['subject'];
    $message->courseNumber = (int) $query->row['course_number'];
    $message->distributionGroup = (int) $query->row['credit_distribution'];
    $message->term = (int) $query->row['term'];
    $message->year = (int) $query->row['year'];
    $message->college = $query->row['college'];
    $message->crn = (int) $query->row['crn'];
    $message->lastUpdate = (int) $query->row['last_update'];
    $message->courseUrl = $query->row['course_url'];
    $message->link = $query->row['link'];
    $message->description = utf8_encode($query->row['description']);
    $message->creditLpap = (boolean) $query->row['credit_lpap'];
    $message->department = $query->row['department'];
    $message->school = $query->row['school'];
    $message->section = (int) $query->row['section'];
    $message->creditHours = (int) $query->row['credit_hours'];
    $message->creditHoursMin = (int) $query->row['credit_hours_min'];
    $message->creditHoursMax = (int) $query->row['credit_hours_max'];
    $message->sessionType = (int) $query->row['session_type'];
    $message->gradeType = (int) $query->row['grade_type'];
    $message->xlistGroup = $query->row['xlist_group'];
    $message->xlistEnrollment = (int) $query->row['xlist_enrollment'];
    $message->xlistWaitlisted = (int) $query->row['xlist_waitlisted'];
    $message->xlistMaxEnrollment = (int) $query->row['xlist_max_enrollment'];
    $message->xlistMaxWaitlisted = (int) $query->row['xlist_max_waitlisted'];
    $message->maxEnrollment = (int) $query->row['max_enrollment'];
    $message->maxWaitlisted = (int) $query->row['max_waitlisted'];
    $message->enrollment = (int) $query->row['enrollment'];
    $message->waitlisted = (int) $query->row['waitlisted'];

    return $message;
  }

  public /*CoursesProtocolMessage*/ function createCoursesResponse(/*CoursesRequestProtocolMessage*/ $request) {
    $response = new CoursesProtocolMessage;

    // TODO(mschurr@): Query based on request params.
    $stmt = $this->db->prepare("SELECT * FROM `courses`;");
    $query = $stmt->execute([]);

    foreach ($query as $row) {
      $response->courses[] = $this->createCourseModel($row['courseid']);
    }

    return $response;
  }
}
