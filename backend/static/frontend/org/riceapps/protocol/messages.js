/**
 * Defines the formats in which data will be retrieved from the back-end server.
 *
 * All messages returned by the back-end are encoded into JSON and need to be deserialized. You will need to type-cast
 * the values returned by the server to match these structures.
 *
 * All messages sent to the back-end should be encoded into JSON and sent as the "_proto" POST parameter.
 *
 * You can verify that the requested action was successful by checking the HTTP status code.
 *
 * In the event of the back-end failing to respond to a request, either:
 *   a) the request times out
 *   b) the back-end returns an HTTP status code other than 200 OK
 *
 * The common error codes that may be returned by the back-end are:
 *   400 Bad Request - input parameter formatted incorrectly
 *   401 Unauthorized - user's session has expired; they should reload the page
 *   403 Forbidden - user's XSRF token has expired; they should reload the page
 *   500 Internal Server Error - an inexplicable server-side error occured; retry later
 *   501 Not Implemented - requested API is not implemented
 *
 * The back-end exposes the following APIs:
 *
 * GET /api/user
 *   INPUTS: none
 *   RETURNS: Messages.User
 * POST /api/user
 *   INPUT: Messages.UserRequest
 *   RETURNS: none (check HTTP status code)
 * POST /api/courses
 *   INPUT: Messages.CoursesRequest
 *   RETURNS: Messages.Courses
 *
 * Note: You will likely not need to interface directly with the back-end; rather, use SchedulePlannerXhrController
 * which will automatically generate and format the requests for you.
 */

goog.provide('org.riceapps.protocol.Messages');
goog.provide('org.riceapps.protocol.Messages.CoursesRequest');
goog.provide('org.riceapps.protocol.Messages.UserRequest');
goog.provide('org.riceapps.protocol.Messages.User');
goog.provide('org.riceapps.protocol.Messages.Playground');
goog.provide('org.riceapps.protocol.Messages.Schedule');
goog.provide('org.riceapps.protocol.Messages.Courses');
goog.provide('org.riceapps.protocol.Messages.CourseMeetingTime');
goog.provide('org.riceapps.protocol.Messages.CourseRestriction');
goog.provide('org.riceapps.protocol.Messages.Instructor');
goog.provide('org.riceapps.protocol.Messages.Course');

goog.scope(function() {
var Messages = org.riceapps.protocol.Messages;


/** @enum {number} */
Messages.Terms = {
  FALL: 0,
  SPRING: 1,
  SUMEMR: 2
};


/**
 * @typedef {{
 *  xsrfToken: string,
 *  userId: number,
 *  keywords: string,
 *  showNonDistribution: string,
 *  showDistribution1: boolean,
 *  showDistribution2: boolean,
 *  showDistribution3: boolean,
 *  hideFull: boolean,
 *  hideConflicts: boolean,
 *  offset: number,
 *  limit: number,
 *  year: number,
 *  term: number
 * }}
 */
Messages.CoursesRequest;


/**
 * @typedef {{
 *   userId: number,
 *   xsrfToken: string,
 *   hasSeenTour: boolean,
 *   playground: Messages.SimpleCourseList,
 *   schedule: Messages.SimpleCourseList
 * }}
 */
Messages.UserRequest;


/**
 * @typedef {{
 *   courses: !Array.<Messages.SimpleCourse>
 * }}
 */
Messages.SimpleCourseList;


/**
 * @typedef {{
 *   courseId: number
 * }}
 */
Messages.SimpleCourse;


/**
 * @typedef {{
 *   userId: number,
 *   userName: string,
 *   xsrfToken: string,
 *   hasSeenTour: boolean,
 *   playground: Messages.Playground,
 *   schedule: Messages.Schedule
 * }}
 */
Messages.User;


/**
 * @typedef {{
 *   courses: !Array.<Messages.Course>
 * }}
 */
Messages.Playground;


/**
 * @typedef {{
 *   courses: !Array.<Messages.Course>
 * }}
 */
Messages.Schedule;


/**
 * @typedef {{
 *   courses: !Array.<Messages.Course>
 * }}
 */
Messages.Courses;


/**
 * @typedef {{
 *   day: number,
 *   start: number,
 *   end: number,
 *   frequency: number,
 *   offset: numer,
 *   limit: number,
 *   building: string,
 *   room: string
 * }}
 */
Messages.CourseMeetingTime;


/**
 * @typedef {{
 *   instructorId: number,
 *   instructorName: string
 * }}
 */
Messages.Instructor;


/**
 * @typedef {{
 *   restrictionType: number,
 *   target: number,
 *   targetSubject: string,
 *   targetCourseNumber: number,
 *   description: string
 * }}
 */
Messages.CourseRestriction;


/**
 * @typedef {{
 *  courseId: number,
 *  meetingTimes: !Array.<Messages.CourseMeetingTime>,
 *  restrictions: !Array.<Messages.CourseRestriction>,
 *  instructors: !Array.<Messages.Instructor>,
 *  title: string,
 *  subject: string,
 *  courseNumber: number,
 *  distributionGroup: number,
 *  term: number,
 *  year: number,
 *  college: string,
 *  crn: number,
 *  lastUpdate: number,
 *  courseUrl: string,
 *  link: string,
 *  description: string,
 *  creditLpap: boolean,
 *  department: string,
 *  school: string,
 *  section: number,
 *  creditHours: number,
 *  creditHoursMin: number,
 *  creditHoursMax: number,
 *  sessionType: number,
 *  gradeType: number,
 *  xlistGroup: string,
 *  xlistEnrollment: number,
 *  xlistWaitlisted: number,
 *  xlistMaxEnrollment: number,
 *  xlistMaxWaitlisted: number,
 *  maxEnrollment: number,
 *  maxWaitlisted: number,
 *  enrollment: number,
 *  waitlisted: number
 * }}
 */
Messages.Course;

});  // goog.scope
