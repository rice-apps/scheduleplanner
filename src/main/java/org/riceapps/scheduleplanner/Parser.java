package org.riceapps.scheduleplanner;

import java.io.File;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import lightning.config.Config;
import lightning.db.MySQLDatabase;
import lightning.db.MySQLDatabaseProvider;
import lightning.db.MySQLDatabaseProviderImpl;
import lightning.util.Flags;

import org.riceapps.scheduleplanner.cache.CourseCache;
import org.riceapps.scheduleplanner.db.Term;
import org.riceapps.scheduleplanner.parser.CourseFetcher;
import org.riceapps.scheduleplanner.protocol.CourseCatalogMessage;

/**
 * Run this program to synchronize the application database with
 * Rice's course catalog.
 * 
 * Options:
 *   --config <file>:     (REQUIRED) Specifies the location of the JSON-formatted config file.
 *                                   See SchedulePlannerConfig and its inheritence tree for structure.
 *                                   Template is provided in src/main/resources.
 *   --reset:             (OPTIONAL) Don't sync, just reset the database. Should be run before changing term/year.
 *   --recache:           (OPTIONAL) Don't sync, just update the cached JSON.
 *   --year <year>:       (REQUIRED) The year to sync.
 *   --term <term>:       (REQUIRED) The term to sync (e.g. fall or spring).
 *   --daemonize:         (OPTIONAL) Run as a daemon that syncs periodically.
 *   --current-xml <file> (OPTIONAL) Specify XML file located locally to parse instead of using Rice API.
 *   --past-xml <file>    (OPTIONAL) Specify XML file located locally to parse instead of using Rice API.
 *   
 */
public class Parser {
  public static void main(String[] args) throws Exception {
    // Parse the command-line flags.
    Flags.parse(args);
    
    // Parse the config from file.
    Config config = ConfigFactory.make(Flags.getFile("config"));
    
    // Create a database connection pool.
    MySQLDatabaseProvider dbp = new MySQLDatabaseProviderImpl(config);
    
    if (Flags.has("reset")) {
      System.out.println("Reseting Database...");
      
      try (MySQLDatabase db = dbp.getDatabase()) {
        db.transaction(() -> {
          db.prepare("DELETE FROM `playgrounds`;").executeUpdateAndClose();
          db.prepare("DELETE FROM `schedules`;").executeUpdateAndClose();
          db.prepare("DELETE FROM `instructors`;").executeUpdateAndClose();
          db.prepare("DELETE FROM `courses`;").executeUpdateAndClose();
          db.prepare("DELETE FROM `course_restrictions`;").executeUpdateAndClose();
          db.prepare("DELETE FROM `course_times`;").executeUpdateAndClose();
          db.prepare("DELETE FROM `course_instructors`;").executeUpdateAndClose();
        });
      }
      
      System.out.println("DONE");
      return;
    }
    
    if (Flags.has("recache")) {
      System.out.println("Updating Cache...");
      
      try (MySQLDatabase db = dbp.getDatabase()) {
        CourseCache.set(CourseCatalogMessage.create(db));
      }
      
      System.out.println("DONE");
      return;
    }
    
    int year = Flags.getInt("year");
    Term term = Flags.getEnumOption("term", Term.class).get();
    CourseFetcher fetcher = CourseFetcher.create(dbp, year, term);
    
    if (Flags.has("daemonize")) {
      Timer timer = new Timer();
      timer.scheduleAtFixedRate(new TimerTask() {        
        @Override
        public void run() {
          try {
            fetcher.sync();
          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      }, 0, TimeUnit.HOURS.toMillis(1));
    } else {
      if (Flags.has("current-xml")) {
        fetcher.sync(new File(Flags.getString("current-xml")), new File(Flags.getString("past-xml")));  
      } else {
        fetcher.sync();
      }
    }
  }
}
