rice-schedule-planner
=====================

A schedule planner and visualizer for students at Rice University.

Requirements (for building):
* Google Closure Library (via `git clone https://github.com/google/closure-library.git closure-library`).
* Google Closure Compiler (via `http://dl.google.com/closure-compiler/compiler-latest.zip`; place JAR at `closure-compiler/compiler.jar`).
* MySQL >= 5
* Python >= 2.7
* Java >= 7
* PHP >= 5.5 or HHVM

Requirements (for deployment):
* MySQL >= 5
* PHP >= 5.5 or HHVM

Installation:
* Install back-end dependencies (`cd backend && composer install`).
* Install the database file located in `database/schema.sql` and `backend/vendor/mschurr/framework/src/schema.sql`.
* Rename `config-template.php` to `config.php` and configure your options.
* Run `php server.php build prod` (for deployment) or `php server.php build dev` (for development).
* Pull new courses from the Rice University database by running `php server.php courses pull`. In production, you will want to set a cron job to run this command periodically.

Development Server:
* `php -S localhost:80 server.php`

Development UI Demo (requires Java, Python, Closure Library, Closure Compiler):
* Build the front-end by running `frontend/build_prod.sh` or `frontend/build_dev.sh`.
* Depending on what you built, open `schedule_planner_dev.html` or `schedule_planner_prod.html` in a browser.

Deployment:
* `./hhvm.sh` or use any PHP-enabled runtime environment
