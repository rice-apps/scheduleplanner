<?php

class CoursesController extends Controller {
  protected /*SchedulePlannerProtocolMessageUtility*/ $utility;

  public function autorun() {
    $this->utility = new SchedulePlannerProtocolMessageUtility($this->database);
  }

  public function get() {
    $response = $this->utility->createCoursesResponse(null);
    $this->response->json(ProtocolMessage::serialize($response), true);
  }

  public function post() {
    // NOTE: We don't catch exceptions, because the framework will catch them and display a 400 Bad Request error.
    $request = ProtocolMessage::unserialize($this->request->post['_proto']);

    if ($request->userId != $this->user->id) {
      return 400;
    }

    if (!$this->utility->checkXsrfToken($this->session, $request->xsrfToken)) {
      return 400;
    }

    $response = $this->utility->createCoursesResponse($request);
    $this->response->json(ProtocolMessage::serialize($response));
  }
}
