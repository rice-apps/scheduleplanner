package org.riceapps.scheduleplanner;

import java.io.File;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import lightning.config.Config;
import lightning.db.MySQLDatabase;
import lightning.db.MySQLDatabaseProvider;
import lightning.util.Flags;

import org.riceapps.scheduleplanner.cache.CourseCache;
import org.riceapps.scheduleplanner.db.Term;
import org.riceapps.scheduleplanner.parser.CourseFetcher;
import org.riceapps.scheduleplanner.protocol.CourseCatalogMessage;


public class Parser {
  public static void main(String[] args) throws Exception {
    Flags.parse(args);
    
    Config config = ConfigFactory.make(Flags.getFile("config"));
    MySQLDatabaseProvider dbp = new MySQLDatabaseProvider(
        config.db.host, 
        config.db.port, 
        config.db.username, 
        config.db.password, 
        config.db.name);
    
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
      if (Flags.has("file")) {
        fetcher.sync(new File(Flags.getString("current-xml")), new File(Flags.getString("past-xml")));  
      } else {
        fetcher.sync();
      }
    }
  }
}
