package org.riceapps.scheduleplanner.protocol;

import java.util.ArrayList;
import java.util.List;

public class ScheduleMessage {
  public List<CourseIdMessage> courses;
  
  public ScheduleMessage() {
    courses = new ArrayList<>();
  }
}
