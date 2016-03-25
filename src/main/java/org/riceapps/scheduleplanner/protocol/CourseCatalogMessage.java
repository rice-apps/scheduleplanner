package org.riceapps.scheduleplanner.protocol;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import lightning.db.MySQLDatabase;
import lightning.db.NamedPreparedStatement;

public class CourseCatalogMessage {
  public List<CourseMessage> courses;
  
  public CourseCatalogMessage() {
    courses = new ArrayList<>();
  }
  
  public static CourseCatalogMessage create(MySQLDatabase db) throws Exception {
    CourseCatalogMessage message = new CourseCatalogMessage();
    
    try (
      NamedPreparedStatement q = db.prepare("SELECT * FROM courses;");
      ResultSet r = q.executeQuery();
    ) {
      while (r.next()) {
        message.courses.add(CourseMessage.create(db, r));
      }
    }
    
    return message;
  }
}
