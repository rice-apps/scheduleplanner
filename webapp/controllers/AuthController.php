<?php

class AuthController extends Controller
{
	public function login($errors=array())
	{
		if($this->auth->loggedIn)
			return Redirect::to('/');

		return View::make('Auth.Login')->with(array(
			'username' => isset($this->request->post['username']) ? $this->request->post['username'] : '',
			'persistent' => isset($this->request->post['persistent']),
			'errors' => $errors
		));
	}

	public function loginAction()
	{
		if(strlen($this->request->post['username']) < 1
		|| strlen($this->request->post['password']) < 1)
			return $this->login(array('You must enter a username and password.'));

		try {
			$this->auth->attempt(
				$this->request->post['username'],
				$this->request->post['password'],
				isset($this->request->post['persistent'])
			);

			return Redirect::to('/');
		}
		catch(AuthException $exception) {
			return $this->login(array(
				$exception->getErrorMessage()
			));
		}
	}

	public function logout()
	{
		$this->auth->logout();
		return Redirect::to(array($this, 'login'));
	}
}