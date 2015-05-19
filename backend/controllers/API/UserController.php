<?php

/**
 * A controller which deals with requests for user information.
 */
class UserController extends Controller {
  protected /*SchedulePlannerProtocolMessageUtility*/ $utility;

  /**
   * @override
   */
  public function autorun() {
    $this->utility = new SchedulePlannerProtocolMessageUtility($this->database);
  }

  /**
   * Handles requests to GET /api/user to return information about active user.
   */
  public function get() {
    $message = $this->utility->createUserModel($this->session);
    $this->response->json(ProtocolMessage::serialize($message), true);
  }

  /**
   * Handles requests to POST /api/user to update information about the active user.
   */
  public function post() {
    $message = null;
    $message = ProtocolMessage::unserialize($this->request->post['_proto'], 'UserRequestProtocolMessage');

    // Check: the message is modifiying the requesting user.
    if ($message->userId != $this->user->id) {
      return 400;
    }

    // Check: XSRF token is correct.
    // TODO(mschurr): Needs additional work as uncommenting this causes consistency problems.
    /*if (!$this->utility->checkXsrfToken($this->session, $message->xsrfToken)) {
      return 401;
    }*/

    // Update database to reflect information sent in the request.
    $this->user->setProperty(SchedulePlannerProtocolMessageUtility::TOUR_PROPERTY,
        $message->hasSeenTour === true);

    $this->user->setProperty(SchedulePlannerProtocolMessageUtility::DISCLAIMER_PROPERTY,
        $message->hasAgreedToDisclaimer === true);

    $this->db->prepare("DELETE FROM `playgrounds` WHERE `userid` = ?")->execute($this->user->id);
    $q = $this->db->prepare("INSERT INTO `playgrounds` (`userid`, `courseid`) VALUES (?, ?);");

    foreach ($message->playground->courses as $course) {
      $q->execute($this->user->id, $course->courseId);
    }

    $this->db->prepare("DELETE FROM `schedules` WHERE `userid` = ?")->execute($this->user->id);
    $q = $this->db->prepare("INSERT INTO `schedules` (`userid`, `courseid`, `year`) VALUES (?, ?, 0);");

    foreach ($message->schedule->courses as $course) {
      $q->execute($this->user->id, $course->courseId);
    }

    $this->response->json(['STATUS' => 'OK'], true);
  }
}
