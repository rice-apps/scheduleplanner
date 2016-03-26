package org.riceapps.scheduleplanner.cache;

import java.io.File;
import java.io.FileWriter;

import lightning.json.JsonFactory;

import org.riceapps.scheduleplanner.protocol.CourseCatalogMessage;

import com.google.gson.FieldNamingPolicy;

public class CourseCache {
  public static File get() {
    return new File("./cache.json");
  }
  
  public static void set(CourseCatalogMessage data) throws Exception {
    try (FileWriter file = new FileWriter("./cache.json")) {
      file.write("')]}\n" + JsonFactory.newJsonParser(FieldNamingPolicy.IDENTITY).toJson(data));
    }
  }
}
