package org.riceapps.scheduleplanner.cache;

import java.io.File;
import java.io.FileWriter;

import org.riceapps.scheduleplanner.protocol.CourseCatalogMessage;

import com.google.gson.FieldNamingPolicy;

import lightning.mvc.Lightning;

public class CourseCache {
  public static File get() {
    return new File("./cache.json");
  }
  
  public static void set(CourseCatalogMessage data) throws Exception {
    try (FileWriter file = new FileWriter("./cache.json")) {
      file.write("')]}\n" + Lightning.newGson(FieldNamingPolicy.IDENTITY).create().toJson(data));
    }
  }
}
