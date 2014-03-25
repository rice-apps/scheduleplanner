<?php
/**
 * Regular Pages
 */
Route::get('/', function(Request $request, Response $response){
	return View::make('Main')->with(array(
		'user' => $request->session->user
	));
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
 * Private API Routes
 */

$filter = function(Request $request) {
	if(!isset($request->get['apikey']))
		return 403;

	// Validate the API key.
	$db = App::getDatabase();
	$stmt = $db->prepare("SELECT * FROM `api_authorization` WHERE `key` = ? LIMIT 1;");
	$res = $stmt->execute($request->get['apikey']);

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