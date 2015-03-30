<?php

class UserController extends Controller {
  protected /*SchedulePlannerProtocolMessageUtility*/ $utility;

  public function autorun() {
    $this->utility = new SchedulePlannerProtocolMessageUtility($this->database);
  }

  public function get() {
    $message = $this->utility->createUserModel($this->session);
    $this->response->json(ProtocolMessage::serialize($message), true);
  }

  public function post() {
    $message = null;
    $message = ProtocolMessage::unserialize($this->request->post['_proto'], 'UserRequestProtocolMessage');

    if ($message->userId != $this->user->id) {
      return 400;
    }

    /*if (!$this->utility->checkXsrfToken($this->session, $message->xsrfToken)) {
      return 401;
    }*/

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
