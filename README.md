scheduleplanner
=====================

A schedule planner and visualizer for students at Rice University maintained by [Rice Apps] (http://www.riceapps.org/).

## Requirements (for building):
* Google Closure Library
  `git clone https://github.com/google/closure-library.git closure-library`
  Place folder at `backend/static/closure-library`.
* Google Closure Compiler
  `wget http://dl.google.com/closure-compiler/compiler-latest.zip`
  Place JAR at `backend/static/closure-compiler/compiler.jar`.
* MySQL >= 5
* Python >= 2.7
* Java >= 7
* PHP >= 5.5 or HHVM
* PHP Composer (https://getcomposer.org/)

## Requirements (for deployment):
* MySQL >= 5
* PHP >= 5.5 or HHVM

## Documentation:
* [Google Closure] (https://developers.google.com/closure/)
* [Closure API Reference] (http://docs.closure-library.googlecode.com/git/index.html)
* [Closure Type Annotation] ( https://developers.google.com/closure/compiler/docs/js-for-compiler)

## Style:
We will be following the [Google JavaScript Style Guide] (https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml). In general,

* Always indent using spaces
* Use unix line endings
* Always end code files with a new line
* Always eliminate trailing spaces
* Always indent using spaces, 2 spaces per tab
* Maximum length of a line is 120 characters
* Always use semicolons to avoid ambiguity in the interpreter
* Always use brackets in control blocks to avoid ambiguity in the interpreter
* Always place two blank lines between top-level blocks
* Always type annotate your code
* Never pollute the global namespace; use goog.scope if neccesary.
* Always use fully qualified names (e.g. `window.console.log` instead of `console.log`)
* To indicate a note: `NOTE(githubuser): MESSAGE`
* To indicate a todo: `TODO(githubuser): MESSAGE`
* Caution: compiler may rewrite property names (e.g. obj.property) for optimization. Use string literals to prevent this (e.g. obj['property']) in areas where renaming at compile time might affect correctness at runtime. Compiler will not rewrite properties that are well known (e.g. DOM node properties).

## Developer Set-Up and Workflow:
1. Clone the code repository.
* Install all of the required software on your system (listed above) and that you have placed the closure dependencies in the correct location.

* Install the back end by typing `composer install` within the backend/ directory. (Note: If you didn’t add composer to your PATH, and you can alternatively run the phar file by typing `php composer.phar install`).

* Start your MySQL database server and create a new database to use for the application.
  * To start mysql: `mysqld`

  * Command line to connect: `mysql -u root -h localhost`
  * To create a database use `create database scheduleplanner`

  * Command line to import: `mysql -u root -p scheduleplanner -h localhost < schema.sql`

* COPY `backend/config-template.php` to `backend/config.php`.

* Edit `backend/config.php` and replace the database connection information with the information of your local MySQL server.

* Import the initial database structure from `database/schema.sql` and `backend/vendor/mschurr/framework/src/schema.sql`.

* Ensure that you have properly configured your HOSTS file (`/etc/hosts` or `C:\Windows\System32\Drivers\etc\hosts`) to bind `local.dev` to `127.0.0.1`. You can do this by simply adding the line `127.0.0.1 local.dev` to your hosts file (requires sudo or administrator).
* Ensure that you have compiled the development version of the closure front end. You can do this by running:
`backend/static/frontend/build_dev.sh` (or .bat if on Windows)

  **NOTE**: You will not need to recompile the development version of the Javascript frequently. In fact, after the initial compile you will ONLY need to compile it when you add a new dependency
(goog.require) or new JavaScript file.

  **NOTE**: You may also build the production Javascript bundle by running build_prod.sh instead. You will not want to use the production bundle to develop; it will make the process significantly slower. However, you will want to occasionally re-build the production bundle in order to perform static analysis (type checking) on your code.

* Import the latest course data from Rice: `php server.php courses pull`

* Start the development server by running the following command within the backend directory: `php -S local.dev:80 server.php`

  **Note**: Linux and Mac OSX users cannot bind to port 80 with using sudo or configuring their machine to allow non-root users to bind to port 80. You can either configure your system, use sudo (not recommended), or pick an alternative port.

* You can view the application in your browser (Chrome usually works best):
  * Development Version (instant refreshes): `http://local.dev/`
  * Production Version (must run `build_prod.sh`): set `app.development` to `false` in `backend/config.php` and then view `http://local.dev/`; set it back to `true` to view the development version again.

* You can now begin making changes to the Javascript code using an IDE of your choice. Your changes will be reflected instantly when you refresh the page.
If you add new files or dependencies (e.g. goog.require()), you will need to re-run `build_dev.sh` in order for the change to take effect.

  * Run the compiler periodically (build_prod.sh) to check for syntax and type errors.
  * Follow the style of existing code (see guidelines above).
  * Use the developer console in Chrome to monitor performance, syntax/runtime errors, and for general debugging.

* **IMPORTANT**: Before committing, you MUST run `build_prod.sh` and ensure that you have not created any compiler warnings.

## Deployment:
1. Set up a MySQL database for use by the application and import the initial data as described above.
* Deploy the application files (backend directory) within a PHP environment. You will need to configure URL rewriting so that requests to `/static/*` are mapped directly and all other requests are mapped to `webapp.php`.
* Create a CRON job that will periodically run the command `php server.php courses pull` to update enrollment data on courses.
