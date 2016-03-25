package org.riceapps.scheduleplanner.protocol;

import java.util.ArrayList;
import java.util.List;

public class PlaygroundMessage {
  public List<CourseIdMessage> courses;
  
  public PlaygroundMessage() {
    courses = new ArrayList<>();
  }
}
