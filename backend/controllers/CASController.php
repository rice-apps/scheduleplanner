<?php
require_once(FRAMEWORK_ROOT."/plugins/CAS.php");

use mschurr\framework\plugins\CAS\CASAuthenticator;

/**
 * A controller for handling authentication via the CAS authentiation driver.
 */
class CASController extends Controller {
  public function login() {
    if ($this->auth->loggedIn) {
      return Redirect::to('/');
    }

    try {
      $this->auth->attempt(null, null, true);
    } catch (AuthException $e) {
      return 400; // Bad Request
    }
  }

  public function loginAction() {}

  public function logout() {
    if (!$this->auth->loggedIn) {
      return Redirect::to('/');
    }

    $this->auth->logout();
  }
}
