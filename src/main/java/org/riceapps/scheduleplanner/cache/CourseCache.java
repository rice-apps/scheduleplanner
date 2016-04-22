package org.riceapps.scheduleplanner.cache;

import java.io.File;
import java.io.FileWriter;

import lightning.json.JsonFactory;

import org.riceapps.scheduleplanner.SchedulePlannerConfig;
import org.riceapps.scheduleplanner.protocol.CourseCatalogMessage;

import com.google.gson.FieldNamingPolicy;

/**
 * A simple system for caching the JSON course catalog sent to the front-end.
 * Recalculating the catalog is expensive, so caching it is imperative.
 */
public class CourseCache {
  public static File get() {
    return new File("./cache.json");
  }
  
  public static void set(CourseCatalogMessage data) throws Exception {
    try (FileWriter file = new FileWriter("./cache.json")) {
      file.write(SchedulePlannerConfig.XSSI_PREFIX + JsonFactory.newJsonParser(FieldNamingPolicy.IDENTITY).toJson(data));
    }
  }
}
