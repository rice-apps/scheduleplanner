<?php

Config::set(array(
	/**
	 * Database Driver Information
	 */
	'database.driver' => 'mysql',
	'database.user' => 'httpd',
	'database.pass' => 'httpd',
	'database.host' => 'localhost',
	'database.port' => '3306',
	'database.name' => 'riceapps',

	/**
	 * Development Mode
	 * 
	 * If development mode is enabled, you will be shown rich error messages. If development mode is not, you will be 
	 *  shown production errors which reveal nothing (although the errors will still be logged).
	 */
	'app.development'	=> true,

	'auth.driver' => 'cas',
	'users.driver' => 'cas',
	'groups.driver' => 'db',

	/**
	 * A long, secret key that will be used to verify the integrity of cookies.
	 */
	'cookies.secretKey' => '230asdkhjado2hjv',

	'auth.cas.host' => 'netid.rice.edu',
	'auth.cas.port' => 443,
	'auth.cas.path' => '/cas',
	'auth.cas.cert' => FILE_ROOT.'/rice-cas.pem'
));