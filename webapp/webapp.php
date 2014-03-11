<?php
/**
 * Regular Pages
 */
Route::get('/', function(Request $request, Response $response){
	$response->write('Home Page!');
});

/**
 * API Routes
 */
Route::get('/api/course/{course_id}', 'API.Course') // add data from other tables
	->where('course_id', '[0-9]+'); 
Route::get('/api/courses', 'API.Courses'); // support for searching
Route::get('/api/schools', 	'API.Schools');
Route::get('/api/departments', 'API.Departments');

/**
 * API Session-Specific Routes
 */

$filter = function(Request $request) {
	if($request->session->auth->loggedIn)
		return true;
	return Redirect::to('AuthController@login');
};

Route::filter($filter, function(){
	Route::get('/api/playground', 'API.Playground@all');
	Route::post('/api/playground/add', 'API.Playground@add');
	Route::post('/api/playground/delete', 'API.Playground@delete');
});

/**
 * Authentication System
 */
Route::get('/login', 'AuthController@login');
Route::post('/login', 'AuthController@loginAction');
Route::get('/logout', 'AuthController@logout');

Route::get('/debug', function(Request $request, Response $response){
	App::getUserService()->create('matthew', 'coolperson');

	$response->write('ok');	
});

/**
 * Error Pages
 */
Route::error(404, function(Request $request, Response $response){
	return View::make('errors.404');
});

Route::error(500, function(Request $request, Response $response){
	return View::make('errors.500');
});