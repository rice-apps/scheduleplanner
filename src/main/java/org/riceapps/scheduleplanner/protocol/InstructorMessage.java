package org.riceapps.scheduleplanner.protocol;

import java.sql.ResultSet;

public class InstructorMessage {
  public long instructorId;
  public String instructorName;
  
  public static InstructorMessage create(ResultSet instructor) throws Exception {
    InstructorMessage message = new InstructorMessage();
    message.instructorId = instructor.getLong("instructorid");
    message.instructorName = instructor.getString("name");
    return message;
  }
}
