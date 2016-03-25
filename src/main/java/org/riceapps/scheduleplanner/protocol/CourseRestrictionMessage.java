package org.riceapps.scheduleplanner.protocol;

import java.sql.ResultSet;

import org.riceapps.scheduleplanner.db.RestrictionType;

public class CourseRestrictionMessage {
  public RestrictionType restrictionType;
  public int target;
  public String targetSubject;
  public int targetCourseNumber;
  public String description;
  
  public static CourseRestrictionMessage create(ResultSet restriction) throws Exception {
    CourseRestrictionMessage message = new CourseRestrictionMessage();
    message.description = restriction.getString("description");
    message.target = 0;
    message.targetCourseNumber = 0;
    message.targetSubject = "";
    message.restrictionType = RestrictionType.UNKNOWN;
    return message;
  }
}
