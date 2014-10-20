/*
  WE MUST USE UTF8 ENCODING!
*/

SET NAMES utf8;
SET CHARACTER SET utf8;
SET character_set_connection=utf8;
SET collation_connection = utf8_unicode_ci;

/* Users */
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userid` int(64) UNSIGNED NOT NULL auto_increment,
  `netid` varchar(16) NOT NULL,
  PRIMARY KEY  (`userid`)
);

/* Playgrounds */
DROP TABLE IF EXISTS `playgrounds`;

CREATE TABLE `playgrounds` (
  `userid` int(64) UNSIGNED NOT NULL,
  `courseid` int(64) UNSIGNED NOT NULL
);

CREATE INDEX `playgrounds_userid` ON `playgrounds` (`userid`);

/* Instructors */
DROP TABLE IF EXISTS `instructors`;

CREATE TABLE `instructors` (
  `instructorid` int(64) UNSIGNED NOT NULL auto_increment,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY  (`instructorid`)
);

/* Schedules */
DROP TABLE IF EXISTS `schedules`;

CREATE TABLE `schedules` (
  `userid` int(64) UNSIGNED NOT NULL,
  `courseid` int(64) UNSIGNED NOT NULL,
  `year` int(64) UNSIGNED NOT NULL
);

CREATE INDEX `schedules_userid` ON `schedules` (`userid`);

/* Course Instructors */
DROP TABLE IF EXISTS `course_instructors`;

CREATE TABLE `course_instructors` (
  `courseid` int(64) UNSIGNED NOT NULL,
  `instructorid` int(64) UNSIGNED NOT NULL
);

CREATE INDEX `course_instructors_courseid` ON `course_instructors` (`courseid`);

/* Course Times */
/*
	typedef enum {
		Sunday = 0,
		Monday = 1,
		Tuesday = 2,
		Wednesday = 3,
		Thursday = 4,
		Friday = 5,
		Saturday = 6
	} day;
*/

DROP TABLE IF EXISTS `course_times`;

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

CREATE INDEX `course_times_courseid` ON `course_times` (`courseid`);

/* Course Restrictions */
/*
	typedef enum {
		CoursePrerequisite = 0,
		CourseCorequisite = 1,
		InstructorPermission = 2,
		RegistrarPermission = 3,
		Major = 4,
		Program = 5,
		Classification = 6,
		Level = 7,
	} restriction_type;
*/

DROP TABLE IF EXISTS `course_restrictions`;

CREATE TABLE `course_restrictions` (
  `courseid` int(64) UNSIGNED NOT NULL,
  `restriction_type` int(32) UNSIGNED NOT NULL,
  `target` int(64) UNSIGNED NOT NULL,
  `target_subject` varchar(4) NOT NULL,
  `target_course_number` int(16) UNSIGNED NOT NULL,
  `description` varchar(128) NOT NULL DEFAULT ''
);

CREATE INDEX `course_restrictions_courseid` ON `course_restrictions` (`courseid`);

/* Courses */
/*
	typdef enum {
		FallTerm = 0,
		SpringTerm = 1,
		SummerTerm = 2
	} term;

	typedef enum {
		Baker = 0,
		Duncan = 1,
		McMurtry = 2,
		Martel = 3,
		Jones = 4,
		Brown = 5,
		Wiess = 6,
		SidRichardson = 7,
		Hanszen = 8,
		Lovett = 9,
		WillRice = 10
	} college;

	typedef enum {
		StandardLetter = 0,
		PassFail = 1
	} grade_type;
*/

DROP TABLE IF EXISTS `courses`;

CREATE TABLE `courses` (
  `courseid` int(64) UNSIGNED NOT NULL auto_increment,
  `year` int(64) UNSIGNED NOT NULL,
  `term` int(32) UNSIGNED NOT NULL,
  `title` varchar(128) NOT NULL,
  `subject` varchar(4) NOT NULL, /* Subject (e.g. COMP)*/
  `course_number` int(16) UNSIGNED NOT NULL, /* 3-Digit Course Number*/
  `college` int(16) UNSIGNED NULL,
  `crn` int(64) UNSIGNED NOT NULL,
  `last_update` int(64) UNSIGNED NOT NULL, /* UNIX Timestamp*/
  `course_url` varchar(255) NULL,
  `link` varchar(255) NULL, /* Link to page on courses.rice.edu*/
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
  `department` varchar(128) NOT NULL, /* e.g. Computer Science*/
  `school` varchar(128) NOT NULL, /* e.g. Engineering, Humanities...*/
  `section` int(32) UNSIGNED NULL,
  `credit_hours` int(32) UNSIGNED NOT NULL,
  `credit_hours_min` int(32) UNSIGNED NULL,
  `credit_hours_max` int(32) UNSIGNED NULL,
  `session_type` int(32) UNSIGNED NOT NULL, /* see courses.rice.edu*/
  `xlist_group` varchar(32) NULL,
  `grade_type` int(32) UNSIGNED NOT NULL,
  PRIMARY KEY  (`courseid`)
);

CREATE INDEX `courses_sessions` ON `courses` (`subject`,`course_number`);
