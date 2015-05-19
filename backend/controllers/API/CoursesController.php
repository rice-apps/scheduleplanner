<?php
/**
 * A controller which deals with requests for course information.
 */
class CoursesController extends Controller {
  protected /*SchedulePlannerProtocolMessageUtility*/ $utility;

  /**
   * @override
   */
  public function autorun() {
    $this->utility = new SchedulePlannerProtocolMessageUtility($this->database);
  }

  /**
   * Handles GET requests to /api/courses as defined in webapp.php.
   */
  public function get() {
    // Attempt to use the cached version for efficiency (if it exists).
    $file = new File(FILE_ROOT.'/cache/courses.json');

    if ($file->exists && $file->isReadable) {
      return $file;
    }

    // Otherwise, calculate the response directly.
    $response = $this->utility->createCoursesResponse(null);
    $this->response->json(ProtocolMessage::serialize($response), true); // "')]}\n"
  }
}
