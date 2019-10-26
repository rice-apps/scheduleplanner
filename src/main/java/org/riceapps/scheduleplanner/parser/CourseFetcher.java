package org.riceapps.scheduleplanner.parser;

import static org.riceapps.scheduleplanner.dom.DOM.children;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import lightning.db.MySQLDatabase;
import lightning.db.MySQLDatabaseProvider;
import lightning.db.NamedPreparedStatement;
import lightning.db.SQLNull;
import lightning.mvc.Param;
import lightning.util.HTTP;
import lightning.util.Iterables;
import lightning.util.Time;

import org.apache.commons.io.IOUtils;
import org.riceapps.scheduleplanner.cache.CourseCache;
import org.riceapps.scheduleplanner.db.Day;
import org.riceapps.scheduleplanner.db.GradeType;
import org.riceapps.scheduleplanner.db.Term;
import org.riceapps.scheduleplanner.dom.DOM.SmartNode;
import org.riceapps.scheduleplanner.protocol.CourseCatalogMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import com.google.common.collect.ImmutableMap;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.common.util.concurrent.ListeningExecutorService;
import com.google.common.util.concurrent.MoreExecutors;

/**
 * Responsible for pulling course data from the Rice University Courses API and synchronizing it into
 * our own internal database. It is safe to run the fetcher over and over again FOR THE SAME YEAR AND
 * TERM. When switching years/terms, you must first clear the database.
 * 
 * Processing occurs in parallel to speed up the synchronization process.
 * 
 * @see https://docs.rice.edu/confluence/display/~lpb1/Courses+API
 */
public class CourseFetcher {
  private static final Logger logger = LoggerFactory.getLogger(CourseFetcher.class);
  private static final int NUM_THREADS = Math.max(8, Runtime.getRuntime().availableProcessors());
  public static final String CATALOG_ENDPOINT = "https://courses.rice.edu/admweb/!swkscat.cat?format=XML&p_action=COURSE&p_term=%s";
  
  static final class CourseId {
    @Override
    public String toString() {
      return "CourseId [subject=" + subject + ", number=" + number + "]";
    }

    @Override
    public int hashCode() {
      final int prime = 31;
      int result = 1;
      result = prime * result + number;
      result = prime * result + ((subject == null) ? 0 : subject.hashCode());
      return result;
    }

    @Override
    public boolean equals(Object obj) {
      if (this == obj)
        return true;
      if (obj == null)
        return false;
      if (getClass() != obj.getClass())
        return false;
      CourseId other = (CourseId) obj;
      if (number != other.number)
        return false;
      if (subject == null) {
        if (other.subject != null)
          return false;
      } else if (!subject.equals(other.subject))
        return false;
      return true;
    }

    public final String subject;
    public final int number;
    
    public CourseId(String subject, int number) {
      this.subject = subject;
      this.number = number;
    }
  }
  
  /**
   * Returns the endpoint for fetching courses for a given year and term.
   * @param year
   * @param term
   * @return
   */
  public static String formatEndpoint(int year, Term term) {
    return String.format(CATALOG_ENDPOINT, formatTermCode(year, term));
  }
  
  /**
   * Formats a term and year into the format accepted by the Rice API.
   * @param year
   * @param term
   * @return
   */
  public static String formatTermCode(int year, Term term) {
    if (term == Term.FALL)
      year += 1; // Because courses.rice.edu makes no sense.
    
    return String.format("%d%s", year, convertTerm(term));
  }
  
  /**
   * Converts a day from the format used by the Rice API into our
   * native representation of a day.
   * @param s
   * @return
   */
  public static Day convertDay(String s) {
    switch (s) {
      case "U": return Day.SUNDAY;
      case "M": return Day.MONDAY;
      case "T": return Day.TUESDAY;
      case "W": return Day.WEDNESDAY;
      case "R": return Day.THURSDAY;
      case "F": return Day.FRIDAY;
      case "S": return Day.SATURDAY;
      default: throw new IllegalArgumentException();
    }
  }
  
  /**
   * Converts a term code used by the Rice API into our native
   * representation of a term.
   * @param s
   * @return
   */
  public static Term convertTerm(String s) {
    switch (s) {
      case "10": return Term.FALL;
      case "20": return Term.SPRING;
      case "30": return Term.SUMMER;
      default: throw new IllegalArgumentException();
    }
  }
  
  /**
   * Converts our native representation of a term into the representation
   * used by the Rice API.
   * @param term
   * @return
   */
  public static String convertTerm(Term term) {
    switch (term) {
      case FALL: return "10";
      case SPRING: return "20";
      case SUMMER: return "30";
      default: throw new IllegalArgumentException();
    }
  }
  
  /**
   * Returns the link to view a course in the catalog given its CRN, year, and term.
   * @param crn
   * @param year
   * @param term
   * @return
   */
  public static String formatLink(long crn, int year, Term term) {
    return String.format("https://courses.rice.edu/admweb/swkscat.main?p_action=COURSE&p_crn=%d&p_term=%s", 
        crn, formatTermCode(year, term));
  }
  
  /**
   * Parses a distribution group from a course.
   * @param courseNode
   * @return
   */
  public static Object parseDistribution(SmartNode courseNode) {
    if (!courseNode.child("DISTS").child("DIST").attribute("code").exists()) {
      return SQLNull.INTEGER;
    }
    
     String code = courseNode.child("DISTS").child("DIST").attribute("code").stringValue();
     switch (code) {
       case "GRP1": return 1;
       case "GRP2": return 2;
       case "GRP3": return 3;
       default: return SQLNull.INTEGER;
     }
  }
  
  /**
   * Parses a section number from a course.
   * @param courseNode
   * @return
   */
  public static Object parseSection(SmartNode courseNode) {
    Param section = courseNode.child("SEQ_NUMB").text();
    
    if (section.isInteger()) {
      return section.intValue();
    } else if (section.isNotEmpty()) {
      // Hack: Section numbers aren't actually numeric like we thought, so try to make them numeric.
      section = Param.wrap("$", section.stringValue().replaceAll("[^0-9]", ""));
      if (section.isInteger()) {
        return section.intValue();
      }
    }
    
    return SQLNull.INTEGER;
  }
  
  private final int year;
  private final Term term;
  private final MySQLDatabaseProvider dbp;
  private final ListeningExecutorService executor;
  
  private CourseFetcher(MySQLDatabaseProvider dbp, int year, Term term) {
    this.year = year;
    this.term = term;
    this.dbp = dbp;
    this.executor = MoreExecutors.listeningDecorator(Executors.newFixedThreadPool(NUM_THREADS));
  }
  
  public static CourseFetcher create(MySQLDatabaseProvider dbp, int year, Term term) {
    return new CourseFetcher(dbp, year, term);
  }
  
  public void sync(File file, File lastYearFile) throws Exception {
    sync(IOUtils.toString(new FileInputStream(file)), IOUtils.toString(new FileInputStream(lastYearFile)));
  }
  
  public void sync() throws Exception {
    logger.debug("Fetching Data: {}", formatEndpoint(year, term));
    logger.debug("Fetching Data: {}", formatEndpoint(year - 1, term));
    
    ListenableFuture<String> data1 = executor.submit(() -> {
      return HTTP.GET(formatEndpoint(year, term));
    });
    
    ListenableFuture<String> data2 = executor.submit(() -> {
      return HTTP.GET(formatEndpoint(year - 1, term));
    });
    
    sync(data1.get(), data2.get());
  }
  
  private static class ProgressReporter extends Thread {
    private long count;
    private long total;
    private long last;
    
    public ProgressReporter() {
      this.count = 0;
      this.total = 0;
      this.last = 0;
    }
    
    public void run() {
      try {
        while(true) {
          if (this.isInterrupted()) {
            return;
          }
          
          if (getTotal() > 0) {
            long progress = getProgress();
            
            if (progress > last) {
              last = progress;
              System.out.format("ProgressUpdate: %d of %d\n", progress, getTotal());
            }
          }
          
          Thread.sleep(500);
        }
      } catch (InterruptedException e) {
        return;
      }
    }
    
    public synchronized void setTotal(long total) {
      this.total = total;
    }
    
    public synchronized long getTotal() {
      return total;
    }
    
    public synchronized long getProgress() {
      return count;
    }
    
    public synchronized void incrementProgress(long count) {
      this.count += count;
    }
  }
  
  private static Document parseXml(String xml) throws ParserConfigurationException, SAXException, IOException {
    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
    DocumentBuilder dcb = dbf.newDocumentBuilder();
    return dcb.parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));
  }
  
  public void sync(String xml, String lastYearXml) throws Exception {
    try {
      logger.debug("Parsing CRNs for Last Year...");
      // Parse the CRNs for past year.
      ConcurrentHashMap<CourseId, Long> pastYearCrns = new ConcurrentHashMap<>();
      Document lastYearDoc = parseXml(lastYearXml);
      for (SmartNode course : (new SmartNode(lastYearDoc.getDocumentElement())).children("COURSE")) {
        pastYearCrns.put(new CourseId(
            course.child("SUBJECT").attribute("code").stringValue(),
            course.child("CRSE_NUMB").text().intValue()
        ), course.child("CRN").text().longValue());
      }
      
      logger.debug("pastYearCrns={}", pastYearCrns);
      
      logger.debug("Starting Sync [THREADS={}]...", NUM_THREADS);
      List<ListenableFuture<Boolean>> futures = new ArrayList<>();
      ProgressReporter progress = new ProgressReporter();
      progress.start();
      
      // Mark all courses with _upgraded=0 to indicate they have not been re-synced.
      try (MySQLDatabase db = dbp.getDatabase()) {
        db.prepare("UPDATE courses SET _upgraded = 0;").executeUpdateAndClose();
      }
      
      for (int taskId = 0; taskId <  NUM_THREADS; taskId++) {
        final int localTaskId = taskId;
        futures.add(executor.submit(() -> {
          // NOTE: Document is **not** thread-safe, hence the reason for doing it this way.
          logger.debug("Parsing Data...");
          Document data = parseXml(xml);
          int i = 0;
          int processed = 0;
          
          if (localTaskId == 0) {
            progress.setTotal(Iterables.length(children(data.getDocumentElement(), e -> e.getNodeType() == Node.ELEMENT_NODE)));
          }
          
          logger.debug("Syncing Data...");
          for (Node _courseNode : children(data.getDocumentElement(), e -> e.getNodeType() == Node.ELEMENT_NODE)) {
            if (i % NUM_THREADS == localTaskId) {
              final SmartNode courseNode = new SmartNode(_courseNode);
              syncCourse(courseNode, pastYearCrns);
              processed += 1;
            }
            
            if (processed == 25) {
              progress.incrementProgress(processed);
              processed = 0;
            }
            
            i += 1;
          }
          
          progress.incrementProgress(processed);
          return true;
        }));
      }
      
      logger.debug("Waiting for Tasks...");
      for (ListenableFuture<Boolean> future : futures)
        future.get();
      progress.interrupt();
      
      try (MySQLDatabase db = dbp.getDatabase()) {
        // Remove any courses that were not touched in the pass.
        // These courses have been removed from the catalog.
        logger.debug("Removing Deleted Courses...");
        db.prepare("DELETE FROM courses WHERE _upgraded = 0;").executeUpdateAndClose();
        db.prepare("DELETE FROM course_restrictions WHERE courseid NOT IN (SELECT courseid FROM courses);").executeUpdateAndClose();
        db.prepare("DELETE FROM course_times WHERE courseid NOT IN (SELECT courseid FROM courses);").executeUpdateAndClose();
        db.prepare("DELETE FROM course_instructors WHERE courseid NOT IN (SELECT courseid FROM courses);").executeUpdateAndClose();
        db.prepare("DELETE FROM playgrounds WHERE courseid NOT IN (SELECT courseid FROM courses);").executeUpdateAndClose();
        db.prepare("DELETE FROM schedules WHERE courseid NOT IN (SELECT courseid FROM courses);").executeUpdateAndClose();
        db.prepare("DELETE FROM instructors WHERE instructorid NOT IN (SELECT instructorid FROM course_instructors);").executeUpdateAndClose();
      
        logger.debug("Writing Cache...");
        CourseCache.set(CourseCatalogMessage.create(db));
      }
      
      logger.debug("Sync finished successfully!");
    } finally {
      executor.shutdownNow();
    }
  }
  
  public void syncCourse(SmartNode courseNode, ConcurrentHashMap<CourseId, Long> pastYearCrns) throws Exception {
    // TODO: 
    // - Credit hours can be decimals
    // - Section can be non-integers
    // - Instructor Net IDs available
    // - Final exam dates/info available
    // - Grading mode available
    // - Long and short course titles available
    // - Instructional method available
    // - Repeatable for credit REPS_CODE
    // - Session type available
    // - College available
    // - More data available for times
    // - Redo how restrictions are dealt with (current schema is lacking)
    
    Map<String, Object> course = new HashMap<>();
    long crn = courseNode.child("CRN").text().longValue();
    course.put("last_update", Time.now());
    course.put("year", year);
    course.put("term", term.ordinal());
    course.put("crn", crn);
    course.put("title", courseNode.child("CRSE_TITLE").text().stringValue());
    course.put("course_number", courseNode.child("CRSE_NUMB").text().intValue());
    course.put("subject", courseNode.child("SUBJECT").attribute("code").stringValue());
    course.put("course_url", courseNode.child("COURSE_URL").text().stringOr(SQLNull.VARCHAR));
    course.put("description", courseNode.child("CRS_TEXT").text().stringOr(""));
    course.put("enrollment", courseNode.child("ENRL").text().intValue());
    course.put("max_enrollment", courseNode.child("MAX_ENRL").text().intValue());
    course.put("waitlisted", courseNode.child("WAIT_COUNT").text().intValue());
    course.put("max_waitlisted", courseNode.child("WAIT_CAPACITY").text().intValue());
    course.put("session_type", 0); // NOT USED RIGHT NOW
    course.put("college", SQLNull.INTEGER); // NOT USED RIGHT NOW
    course.put("grade_type", GradeType.STANDARD_LETTER.ordinal()); // NOT USED RIGHT NOW
    course.put("school", courseNode.child("SCHOOL").text().stringValue());
    course.put("link", formatLink(crn, year, term));
    course.put("credit_lpap", course.get("subject").equals("LPAP"));
    course.put("credit_distribution", parseDistribution(courseNode));
    course.put("department", courseNode.child("DEPARTMENT").text().stringValue());
    course.put("section", parseSection(courseNode));
    double creditHoursMin = courseNode.child("CREDITS").attr("low").doubleValue();
    double creditHoursMax = courseNode.child("CREDITS").attr("high").doubleOption().or(courseNode.child("CREDITS").attr("low").doubleValue());
    course.put("credit_hours_min", (int) creditHoursMin);
    course.put("credit_hours", course.get("credit_hours_min"));
    course.put("credit_hours_max", (int) creditHoursMax);
    course.put("xlist_group", courseNode.child("XLST_GROUP").text().stringOr(SQLNull.VARCHAR));
    course.put("xlist_enrollment", courseNode.child("XLST_ENRL").text().intOr(SQLNull.INTEGER));
    course.put("xlist_max_enrollment", courseNode.child("XLST_MAX_ENRL").text().intOr(SQLNull.INTEGER));
    course.put("xlist_waitlisted", courseNode.child("WAIT_COUNT").text().intValue());
    course.put("xlist_max_waitlisted", courseNode.child("WAIT_CAPACITY").text().intValue());
    course.put("_upgraded", true);
    
    CourseId id = new CourseId(
      courseNode.child("SUBJECT").attribute("code").stringValue(),
      courseNode.child("CRSE_NUMB").text().intValue()
    );
    
    if (pastYearCrns.containsKey(id)) {
      course.put("prev_year_crn", pastYearCrns.get(id));
    } else {
      course.put("prev_year_crn", SQLNull.INTEGER);
    }
    
    // Find whether or not this course is already present in the database.
    // If it is, we should update the existing record rather than inserting a new one.
    try (MySQLDatabase db = dbp.getDatabase()) {
      try (NamedPreparedStatement q = db.prepare("SELECT courseid FROM courses WHERE term = :term AND year = :year AND crn = :crn;",
               ImmutableMap.of("term", term.ordinal(), "year", year, "crn", crn));
           ResultSet r = q.executeQuery()) {
        if (r.next()) {
          course.put("courseid", r.getLong("courseid"));
        }
      }
      
      long courseId = db.prepareReplace("courses", course).executeInsertAndClose();
      
      // Sync instructors.
      db.prepare("DELETE FROM course_instructors WHERE courseid = :courseid;",
          ImmutableMap.of("courseid", courseId)).executeUpdateAndClose();
      for (long instructorId : syncInstructors(db, courseNode)) {
        db.prepareInsert("course_instructors", ImmutableMap.of(
            "courseid", courseId,
            "instructorId", instructorId
        )).executeUpdateAndClose();
      }
      
      // Sync restrictions.
      syncRestrictions(db, courseId, courseNode);
      syncTimes(db, courseId, courseNode);
    }
  }
  
  /**
   * Syncs the times on a course.
   * @param db
   * @param courseId
   * @param courseNode
   * @throws Exception
   */
  public void syncTimes(MySQLDatabase db, long courseId, SmartNode courseNode) throws Exception {
    db.prepare("DELETE FROM course_times WHERE courseid = :courseid;",
        ImmutableMap.of("courseid", courseId)).executeUpdateAndClose();
    
    for (SmartNode meeting : courseNode.child("TIMES").children("MEETING")) {
      if (!meeting.attr("begin-time").exists()) {
        continue;
      }
      
      if (!meeting.child("TYPE").attr("code").isEqualTo("CLAS")) {
        continue;
      }
      
      Map<String, Object> time = new HashMap<>();
      time.put("courseid", courseId);
      time.put("time_start", parseTime(meeting.attr("begin-time").intValue()));
      time.put("time_end", parseTime(meeting.attr("end-time").intValue()));
      time.put("room_number", meeting.child("ROOM").attr("room").intOr(SQLNull.INTEGER));
      time.put("building_code", meeting.child("ROOM").child("BUILDING").attr("code").stringOr(SQLNull.STRING));
      
      for (Day day : parseDays(meeting)) {
        time.put("day", day.ordinal());
        db.prepareInsert("course_times", time).executeUpdateAndClose();
      }
    }
  }
  
  /**
   * Parses the days out of a MEETING element.
   * @param meeting
   * @return
   */
  public static List<Day> parseDays(SmartNode meeting) {
    List<Day> days = new ArrayList<>();
    
    for (Day d : Day.values()) {
      if (meeting.child(d.xmlRep()).exists()) {
        days.add(d);
      }
    }
    
    return days;
  }
  
  /**
   * Parses a time (in military time expressed as an integer) to minutes from the start
   * of the day.
   * @param time
   * @return
   */
  public static int parseTime(int time) {
    String t = Integer.toString(time);
    String minutes = t.substring(t.length() - 2, t.length());
    String hours = t.length() > 2 ? t.substring(0, t.length() - 2) : "0";
    return Integer.parseInt(minutes) + 60 * Integer.parseInt(hours);
  }
  
  /**
   * Syncs the restrictions on a course.
   * @param db
   * @param courseId
   * @param courseNode
   * @throws Exception
   */
  public void syncRestrictions(MySQLDatabase db, long courseId, SmartNode courseNode) throws Exception {
    db.prepare("DELETE FROM course_restrictions WHERE courseid = :courseid;",
        ImmutableMap.of("courseid", courseId)).executeUpdateAndClose();
    
    if (courseNode.child("PREQ").exists()) {
      addRestriction(db, courseId, "Requires " + courseNode.child("PREQ").text().stringValue());
    }
    
    for (SmartNode n : courseNode.child("COREQS").children("COREQ")) {
      addRestriction(db, courseId, String.format("Requires you to be enrolled in %s %s", 
          n.attr("SUBJ").stringValue(),
          n.attr("NUMB").stringValue()));
    }
    
    if (courseNode.child("RECOMMENDATION").exists()) {
      addRestriction(db, courseId, courseNode.child("RECOMMENDATION").text().stringValue());
    }
    
    if (courseNode.child("INSTRUCTOR_PERMISSION").exists()) {
      addRestriction(db, courseId, courseNode.child("INSTRUCTOR_PERMISSION").text().stringValue());
    }
    
    if (courseNode.child("OR_PERMISSION").exists()) {
      addRestriction(db, courseId, "Requirements may be bypassed with instructor permission.");
    }
    
    if (courseNode.child("OR_TEST").exists()) {
      addRestriction(db, courseId, "Requirements may be bypassed with placement test.");
    }
    
    // Perhaps the worst formatting possible...
    boolean inRestriction = false;
    String buffer = "";
    
    for (SmartNode r : courseNode.child("RESTRICTIONS").children("RESTRICTION")) {
      if (r.attr("ind").exists()) {
        if (inRestriction) {
          addRestriction(db, courseId, buffer);
          buffer = "";
        }
        
        inRestriction = true;
      }
      
      if (inRestriction) {
        if (!buffer.isEmpty() && !buffer.endsWith(" ")) {
          buffer += ", ";
        }
        buffer += r.text().stringValue();
      }
    }
    
    if (inRestriction) {
      addRestriction(db, courseId, buffer);
    }
  }
  
  /**
   * Adds a restriction to a course.
   * @param db
   * @param courseId
   * @param text
   * @throws Exception
   */
  public void addRestriction(MySQLDatabase db, long courseId, String text) throws Exception {   
    db.prepareInsert("course_restrictions", 
        ImmutableMap.<String, Object>builder()
        .put("courseid", courseId)
        .put("restriction_type", 0) // unused
        .put("target", 0) // unused
        .put("target_subject", "") // unused
        .put("target_course_number", 0) // unused
        .put("description", text)
        .build()).executeUpdateAndClose();
  }
  
  /**
   * Syncs instructors attached to the course into the course_instructors table.
   * @param courseNode
   * @return Instructor IDs for instructors of the given course.
   * @throws Exception
   */
  public List<Long> syncInstructors(MySQLDatabase db, SmartNode courseNode) throws Exception {
    List<Long> instructorIds = new ArrayList<>();
    
    for(SmartNode nameNode : courseNode.child("INSTRUCTORS").children("NAME")) {
      instructorIds.add(db.transaction(() -> {
        String name = nameNode.text().stringValue();
        
        // If the instructor exists already, re-use their ID.
        try (NamedPreparedStatement q = db.prepare("SELECT * FROM instructors WHERE name = :name LIMIT 1;", 
                ImmutableMap.of("name", name));
             ResultSet r = q.executeQuery()) {
          if (r.next()) {
            return r.getLong("instructorid");
          }
        }
        
        // Otherwise, insert a record and return the assigned ID.
        return db.prepareInsert("instructors", ImmutableMap.of("name", name))
            .executeInsertAndClose();
      }));
    }
    
    return instructorIds;
  }
}
