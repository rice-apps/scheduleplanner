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
    try {
      $message = ProtocolMessage::unserialize($this->request->post['_proto'], 'UserRequestProtocolMessage');
    } catch (ProtocolMessageException $e) {
      return 400;
    }

    if ($message->userId != $this->user->id) {
      return 400;
    }

    if (!$this->utility->checkXsrfToken($this->session, $message->xsrfToken)) {
      return 401;
    }

    // TODO(mschurr@): Update database based on the following properties:
    $this->user->setProperty(SchedulePlannerProtocolMessageUtility::TOUR_PROPERTY, $message->hasSeenTour === true);
    //public /*PlaygroundProtocolMessage*/ $playground;
    //public /*ScheduleProtocolMessage */ $schedule;

    $this->response->write('200 OK');
  }
}
