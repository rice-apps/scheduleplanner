<?php
/**
 * PHP Command Line Server Rewrite Integration
 * USAGE: php -S localhost:80 server.php
 */
if(php_sapi_name() == 'cli-server') {
	$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
	
	if ($uri !== '/' and file_exists($_SERVER['DOCUMENT_ROOT'].$uri))
	{
		return false;
	}	
}

require("./index.php");
