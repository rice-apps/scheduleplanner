<?php
/**
 * Regular Pages
 */
Route::get('/', function(Request $request, Response $response){
	if($request->session->user === null)
		return Redirect::to('AuthController@login');
		//return View::make('Unauthorized')->with(array('user' => null));

	return View::make('Main')->with(array(
		'user' => $request->session->user
	));
});

/**
 * API Routes
 */

$filter = function(Request $request) {
	if($request->session->auth->loggedIn)
		return true;
	return 403;
};

Route::filter($filter, function(){
	Route::get('/api/course/{course_id}', 'API.Course') // add data from other tables
		->where('course_id', '[0-9]+'); 
	Route::get('/api/courses', 'API.Courses'); // support for searching
	Route::get('/api/schools', 	'API.Schools');
	Route::get('/api/departments', 'API.Departments');
});

/**
 * API Session-Specific Routes
 */
$filter = function(Request $request) {
	if($request->session->auth->loggedIn)
		return true;
	return 403;
};

Route::filter($filter, function(){
	Route::get('/api/playground', 'API.Playground@all');
	Route::post('/api/playground/add', 'API.Playground@add');
	Route::post('/api/playground/delete', 'API.Playground@delete');
	Route::get('/api/schedule/{year}', 'API.Schedule@all')->where('year', '[0-9]+');
	Route::post('/api/schedule/{year}/add', 'API.Schedule@add')->where('year', '[0-9]+');
	Route::post('/api/schedule/{year}/delete', 'API.Schedule@delete')->where('year', '[0-9]+');
});

/**
 * Private API Routes
 */

$filter = function(Request $request) {
	if(!isset($request->get['apikey']))
		return 403;

	// Validate the API key.
	$db = App::getDatabase();
	$stmt = $db->prepare("SELECT * FROM `api_authorization` WHERE `key` = ? LIMIT 1;");
	$res = $stmt->execute($request->get['apikey']);

	// TODO(mschurr): Use caching to speed this up.

	if(len($res) == 0)
		return false;

	return true;
};

Route::filter($filter, function(){
	Route::get('/api/instructor-reviews/{course_id}', 'API.InstructorReviews@get');
	Route::get('/api/course-reviews/{course_id}', 'API.CourseReviews@get');
});

/**
 * Authentication System
 */
Route::get('/login', 'AuthController@login');
Route::post('/login', 'AuthController@loginAction');
Route::get('/logout', 'AuthController@logout');

/**
 * Error Pages
 */
Route::error(404, function(Request $request, Response $response){
	return View::make('errors.404');
});

Route::error(500, function(Request $request, Response $response){
	return View::make('errors.500');
});