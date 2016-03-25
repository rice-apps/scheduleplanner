package org.riceapps.scheduleplanner.protocol;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import lightning.db.MySQLDatabase;
import lightning.db.NamedPreparedStatement;
import lightning.db.ResultSets;
import lightning.util.Enums;

import org.riceapps.scheduleplanner.db.College;
import org.riceapps.scheduleplanner.db.GradeType;
import org.riceapps.scheduleplanner.db.Term;

import com.google.common.base.Optional;
import com.google.common.collect.ImmutableMap;

public class CourseMessage {
  public long courseId;
  public List<CourseMeetingTimeMessage> meetingTimes;
  public List<CourseRestrictionMessage> restrictions;
  public List<InstructorMessage> instructors;
  public String title;
  public String subject;
  public int courseNumber;
  public int distributionGroup;
  public Term term;
  public int year;
  public College college;
  public int crn;
  public long lastUpdate;
  public String courseUrl;
  public String link;
  public String description;
  public boolean creditLpap;
  public String department;
  public String school;
  public int section;
  public int creditHours;
  public int creditHoursMin;
  public int creditHoursMax;
  public int sessionType;
  public GradeType gradeType;
  public String xlistGroup;
  public int xlistEnrollment;
  public int xlistWaitlisted;
  public int xlistMaxEnrollment;
  public int xlistMaxWaitlisted;
  public int maxEnrollment;
  public int maxWaitlisted;
  public int enrollment;
  public int waitlisted;
  public Integer prevYearCrn;
  
  public CourseMessage() {
    instructors = new ArrayList<>();
    meetingTimes = new ArrayList<>();
    restrictions = new ArrayList<>();
  }
  
  public static CourseMessage create(MySQLDatabase db, ResultSet course) throws Exception {
    CourseMessage message = new CourseMessage();
    message.courseId = course.getLong("courseid");
    message.title = course.getString("title");
    message.subject = course.getString("subject");
    message.courseNumber = course.getInt("course_number");
    message.crn = course.getInt("crn");
    message.year = course.getInt("year");
    message.term = Enums.getValue(Term.class, course.getInt("term")).get();
    message.college = null; // UNUSED FOR NOW (field 'college')
    message.lastUpdate = course.getLong("last_update");
    message.prevYearCrn = ResultSets.getInteger(course, "prev_year_crn");
    message.distributionGroup = course.getInt("credit_distribution"); // NOTE: Doesn't handle nulls.
    message.creditLpap = course.getBoolean("credit_lpap");
    message.courseUrl = course.getString("course_url");
    message.link = course.getString("link");
    message.description = Optional.fromNullable(course.getString("description")).or("");
    message.department = course.getString("department");
    message.school = course.getString("school");
    message.section = course.getInt("section");
    message.creditHours = course.getInt("credit_hours");
    message.creditHoursMin = course.getInt("credit_hours_min");
    message.creditHoursMax = course.getInt("credit_hours_max");
    message.sessionType = 0;
    message.xlistGroup = Optional.fromNullable(course.getString("xlist_group")).or("");
    message.enrollment = course.getInt("enrollment");
    message.waitlisted = course.getInt("waitlisted");
    message.maxEnrollment = course.getInt("max_enrollment");
    message.maxWaitlisted = course.getInt("max_waitlisted");
    message.xlistEnrollment = course.getInt("xlist_enrollment");
    message.xlistWaitlisted = course.getInt("xlist_waitlisted");
    message.xlistMaxEnrollment = course.getInt("xlist_max_enrollment");
    message.xlistMaxWaitlisted = course.getInt("xlist_max_waitlisted");
    message.gradeType = Enums.getValue(GradeType.class, course.getInt("grade_type")).get();
    
    try (
      NamedPreparedStatement q = db.prepare("SELECT * FROM course_times WHERE courseid = :courseid;",
          ImmutableMap.of("courseid", message.courseId));
      ResultSet r = q.executeQuery();
    ) {
      while (r.next()) {
        message.meetingTimes.add(CourseMeetingTimeMessage.create(r));
      }
    }
    
    try (
      NamedPreparedStatement q = db.prepare("SELECT * FROM course_restrictions WHERE courseid = :courseid;",
          ImmutableMap.of("courseid", message.courseId));
      ResultSet r = q.executeQuery();
    ) {
      while (r.next()) {
        message.restrictions.add(CourseRestrictionMessage.create(r));
      }
    }
    
    try (
      NamedPreparedStatement q = db.prepare(
            "SELECT * FROM course_instructors "
          + "JOIN instructors ON instructors.instructorid = course_instructors.instructorid  "
          + "WHERE courseid = :courseid;",
          ImmutableMap.of("courseid", message.courseId));
      ResultSet r = q.executeQuery();
    ) {
      while (r.next()) {
        message.instructors.add(InstructorMessage.create(r));
      }
    }
    
    return message;
  }
}
