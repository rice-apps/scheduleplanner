package org.riceapps.scheduleplanner.protocol;

import java.sql.ResultSet;

import lightning.util.Enums;

import org.riceapps.scheduleplanner.db.Day;

import com.google.common.base.Optional;

public class CourseMeetingTimeMessage {
  public Day day;
  public int start;
  public int end;
  public int frequency;
  public int offset;
  public int limit;
  public String building;
  public String room;
  
  public static CourseMeetingTimeMessage create(ResultSet time) throws Exception {
    CourseMeetingTimeMessage message = new CourseMeetingTimeMessage();
    message.building = Optional.fromNullable(time.getString("building_code")).or("");
    message.room = Optional.fromNullable(time.getString("room_number")).or("");
    message.frequency = time.getInt("frequency");
    message.limit = time.getInt("limit");
    message.offset = time.getInt("offset");
    message.day = Enums.getValue(Day.class, time.getInt("day")).get();
    message.start = time.getInt("time_start");
    message.end = time.getInt("time_end");
    return message;
  }
}
