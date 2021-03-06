package org.riceapps.scheduleplanner.controllers;

import static lightning.enums.HTTPMethod.GET;
import static lightning.enums.HTTPMethod.POST;
import static lightning.server.Context.accessViolationIf;
import static lightning.server.Context.badRequestIf;
import static lightning.server.Context.db;
import static lightning.server.Context.parseJson;
import static lightning.server.Context.session;
import static lightning.server.Context.user;

import java.sql.ResultSet;
import java.util.Map;

import lightning.ann.Json;
import lightning.ann.QParam;
import lightning.ann.RequireAuth;
import lightning.ann.Route;
import lightning.db.NamedPreparedStatement;
import lightning.enums.JsonFieldNamingPolicy;

import org.riceapps.scheduleplanner.SchedulePlannerConfig;
import org.riceapps.scheduleplanner.protocol.CourseIdMessage;
import org.riceapps.scheduleplanner.protocol.UserModelMessage;
import org.riceapps.scheduleplanner.protocol.UserModelPushMessage;

import com.google.common.collect.ImmutableMap;

public class UserAPIController extends AbstractController {
  @Route(path="/api/user", methods={GET})
  @Json(prefix=SchedulePlannerConfig.XSSI_PREFIX, names=JsonFieldNamingPolicy.IDENTITY)
  @RequireAuth
  public UserModelMessage handleFetchUser() throws Exception {
    UserModelMessage message = new UserModelMessage();
    
    message.userId = user().getId();
    message.userName = user().getUserName();
    message.xsrfToken = session().newXSRFToken();
    message.hasAgreedToDisclaimer = user().getProperty("HAS_AGREED_TO_DISCLAIMER").booleanOption().or(false);
    message.hasSeenTour = user().getProperty("HAS_SEEN_TOUR").booleanOption().or(false);
    message.lastSeenVersion = user().getProperty("LAST_SEEN_VERSION").intOption().or(0);
        
    try (
      NamedPreparedStatement q = db().prepare("SELECT * FROM playgrounds WHERE userid = :userid;",
          ImmutableMap.of("userid", user().getId()));
      ResultSet r = q.executeQuery();
    ) {
      while (r.next()) {
        CourseIdMessage courseIdMessage = new CourseIdMessage();
        courseIdMessage.courseId = r.getLong("courseid");
        message.playground.courses.add(courseIdMessage);
      }
    }
    
    try (
        NamedPreparedStatement q = db().prepare("SELECT * FROM schedules WHERE userid = :userid;",
            ImmutableMap.of("userid", user().getId()));
        ResultSet r = q.executeQuery();
      ) {
        while (r.next()) {
          CourseIdMessage courseIdMessage = new CourseIdMessage();
          courseIdMessage.courseId = r.getLong("courseid");
          message.schedule.courses.add(courseIdMessage);
        }
      }
    
    return message;
  }
  
  @Route(path="/api/user", methods={POST})
  @Json(prefix=SchedulePlannerConfig.XSSI_PREFIX, names=JsonFieldNamingPolicy.IDENTITY)
  @RequireAuth
  public Map<String, ?> handleUserPush(@QParam("_proto") String data) throws Exception {
    UserModelPushMessage request = parseJson(data, UserModelPushMessage.class, JsonFieldNamingPolicy.IDENTITY);
    badRequestIf(!request.xsrfToken.equals(session().getXSRFToken()));
    accessViolationIf(request.userId != user().getId());
    badRequestIf(request.lastSeenVersion < 0);
    
    // Set lastSeenVersion, hasAgreedToDisclaimer
    user().setProperty("LAST_SEEN_VERSION", request.lastSeenVersion);
    user().setProperty("HAS_AGREED_TO_DISCLAIMER", request.hasAgreedToDisclaimer);
    user().setProperty("HAS_SEEN_TOUR", request.hasSeenTour);
    user().save();
    
    // Sync playground
    db().prepare("DELETE FROM playgrounds WHERE userid = :userid;",
        ImmutableMap.of("userid", user().getId())).executeUpdateAndClose();
    
    for (CourseIdMessage course : request.playground.courses) {
      // TODO: should probably check foreign key constraint
      db().prepareInsert("playgrounds", ImmutableMap.of(
          "userid", user().getId(),
          "courseid", course.courseId
      )).executeUpdateAndClose();
    }
    
    // Sync schedule
    db().prepare("DELETE FROM schedules WHERE userid = :userid;",
        ImmutableMap.of("userid", user().getId())).executeUpdateAndClose();
    
    for (CourseIdMessage course : request.schedule.courses) {
      // TODO: should probably check foreign key constraint
      db().prepareInsert("schedules", ImmutableMap.of(
          "userid", user().getId(),
          "courseid", course.courseId,
          "year", 0 // UNUSED FOR NOW
      )).executeUpdateAndClose();
    }
    
    return ImmutableMap.of("status", "OK");
  }
}
