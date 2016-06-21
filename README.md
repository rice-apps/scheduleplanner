scheduleplanner
=====================

An open-source schedule planner and visualizer for university students maintained by [Rice Apps](http://www.riceapps.org/).

You can view the application live at [scheduleplanner.riceapps.org](http://scheduleplanner.riceapps.org).

## Requirements (for development):
* Google Closure Library
  * Clone [closure-library](https://github.com/google/closure-library.git).
  * Place cloned folder at `src/main/resources/org/riceapps/scheduleplanner/assets/closure-library`.
* Google Closure Compiler
  * Download [compiler-latest.zip](http://dl.google.com/closure-compiler/compiler-latest.zip).
  * Extract and place JAR at `src/main/resources/org/riceapps/scheduleplanner/assets/closure-compiler/compiler.jar`.
* MySQL >= 5
* Python >= 2.7
* Java >= 8
* Maven Package Manager (for Java)

## Requirements (for deployment):
* MySQL >= 5
* Java >= 8

## Documentation:
* [Google Closure](https://developers.google.com/closure/)
* [Closure Standard Library API Reference](https://google.github.io/closure-library/api/)
* [Closure Type Annotation](https://developers.google.com/closure/compiler/docs/js-for-compiler)
* [Lightning Java](https://lightning-framework.github.io/)

## JS Style:
We will be following the [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml). You may want to configure your IDE to automatically format your code to match this style.

In general,

* Always indent using spaces
* Use unix line endings
* Always end code files with a new line
* Always eliminate trailing spaces
* Always indent using spaces, 2 spaces per tab
* Maximum length of a line is 140 characters
* Always use semicolons to avoid ambiguity in the interpreter
* Always use brackets in control blocks to avoid ambiguity in the interpreter
* Always place two blank lines between top-level blocks
* Always type annotate your code
* Never pollute the global namespace; use goog.scope if neccesary.
* Always use fully qualified names (e.g. `window.console.log` instead of `console.log`)
* To indicate a note: `NOTE(githubuser): MESSAGE`
* To indicate a todo: `TODO(githubuser): MESSAGE`
* Caution: compiler may rewrite property names (e.g. obj.property) for optimization. Use string literals to prevent this (e.g. obj['property']) in areas where renaming at compile time might affect correctness at runtime. Compiler will not rewrite properties that are well known (e.g. DOM node properties).

In order to make following style more convenient, you can utilize the [Closure Linter](https://developers.google.com/closure/utilities/docs/linter_howto) and `fixjsstyle`.

## Java Style

We will be following the [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html). You may want to configure your IDE to automatically format code to match this style.

## Developer Set-Up and Workflow:
1. Install the required software for development (listed above).
2. Clone this `scheduleplanner` repository using GIT.
3. Download the closure dependencies (listed above) and place them at the proper locations within the repo.
4. Set up the dependency `lightning` from [lightning-framework/lightning](https://github.com/lightning-framework/lightning) using GIT.
    * `git clone https://github.com/lightning-framework/lightning.git`
    * `cd lightning`
    * `mvn install`
5. Set up the dependency `lightning-cas` from [lightning-framework/lightning-cas](https://github.com/lightning-framework/lightning-cas) using GIT.
    * `git clone https://github.com/lightning-framework/lightning-cas.git`
    * `cd lightning-cas`
    * `mvn install`
6. Import `scheduleplanner` into your Java IDE. (Eclipse > File > Import > Existing Maven Project).
7. Start your MySQL database server and create a new database to use for the application.
    * To start mysql: `mysqld`
    * Command line to connect: `mysql -u root -h localhost`
    * To create a database use `create database scheduleplanner`
    * Command line to import: `mysql -u root -p scheduleplanner -h localhost < schema.sql`
8. Import the initial schema files located at:
    * `lightning/src/main/resources/schema/schema.sql`
    * `scheduleplanner/src/main/resources/org/riceapps/scheduleplanner/database/schema.sql`
9. Copy `scheduleplanner/src/main/resources/org/riceapps/scheduleplanner/config-template.json` to `config.json` in any folder on your machine. Edit the settings in the copy to fit your machine. Ensure `enable_debug_mode` is set to `true`.
10. Compile the development version of the closure front end.
    * `scheduleplanner/src/main/resources/org/riceapps/scheduleplanner/assets/frontend/build_dev.sh` (bat equivalent available for Windows systems)
    * **NOTE**: You will not need to recompile the development version of the Javascript frequently. In fact, after the initial compile you will ONLY need to compile it when you add a new dependency (goog.require) or new JavaScript file.
    * **NOTE**: You may also build the production Javascript bundle by running `build_prod.sh` instead. You will not want to use the production bundle to develop; it will make the process significantly slower. **However, you will want to occasionally re-build the production bundle in order to perform static analysis (type checking) on your code.**
11. Sync your application database with Rice's course database server.
    * Run `org.riceapps.scheduleplanner.Parser --config /path/to/config.json --term Spring --year 2016` (you may replace year and term to match current term)
12. Start the development web server.
     * Run `org.riceapps.scheduleplanner.Launcher --config /path/to/config.json`
     * **Note**: Linux and Mac OSX users cannot bind to port 80 with using sudo or configuring their machine to allow non-root users to bind to port 80. You can either configure your system, use sudo (not recommended), or pick an alternative port in your config file.
13. View the application in your browser (Chrome works best) at [http://localhost/](http://localhost).
14. You can now begin making changes to the Javascript code using an IDE of your choice. Your changes will be reflected instantly when you refresh the page. If you add new files or dependencies (e.g. goog.require()), you will need to re-run `build_dev.sh` in order for the change to take effect.
    * Run the compiler periodically (build_prod.sh) to check for syntax and type errors.
    * Follow the style of existing code (see guidelines above).
    * Use the developer console in Chrome to monitor performance, syntax/runtime errors, and for general debugging.

**IMPORTANT**: Before committing, you MUST run `build_prod.sh` and ensure that you have not created any compiler warnings.

## Deployment:
1. Set up a MySQL database for use by the application and import the initial data (as described above).
2. Create a configuration file based off of `src/main/resources/org/riceapps/scheduleplanner/config-template.json` (as described above).
3. Package the application into a JAR (named `sp.jar`) using Maven/Eclipse (`mvn assembly:single`) and upload the JAR to your server nodes.
4. Run `java -jar sp.jar --config /path/to/config.json` to start the app web server.
5. Run `java -cp sp.jar org.riceapps.scheduleplaner.Parser --config /path/to/config.json --term TERM --year YEAR --daemonize` to pull new course data periodically. You will need to restart this program with new parameters when the term and/or year changes.
