<?php
/**
 * Rice Schedule Planner Routing Table
 */

import('ProtocolMessage');
import('SchedulePlannerProtocolMessages');

scope(function() {
	// Filter: If the user is logged in, allow the request. Otherwise, display an HTTP 403 Unauthorized Error.
	$apiFilter = function(Request $request) {
		if ($request->session->auth->loggedIn) {
			return true;
		}

		return 401; // HTTP 401 Unauthorized
	};

	// Filter: If the user is logged in, allow the request. Otherwise, redirect them to the login page.
	$authFilter = function(Request $request) {
		if ($request->session->auth->loggedIn) {
			return true;
		}

		return Redirect::to('/login');
	};

	// Route: Authentication System
	Route::get ('/login',  'CASController@login');
	Route::post('/login',  'CASController@loginAction');
	Route::get ('/logout', 'CASController@logout');

	// Route: Access Restricted Pages
	Route::filter($authFilter, function() {
		Route::get('/', function(Request $request, Response $response) {
			if (Config::get('app.development', false)) {
				return View::make('SchedulePlannerDevelopment');
			} else {
				return View::make('SchedulePlanner');
			}
		});
	});

	// Route: API Access Restricted Pages
	Route::filter($apiFilter, function() {
		Route::get ('/api/user', 'API.UserController');
		Route::post('/api/user', 'API.UserController');
		Route::get ('/api/courses', 'API.CoursesController');
		Route::post('/api/courses', 'API.CoursesController');
	});
});
