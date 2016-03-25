package org.riceapps.scheduleplanner.controllers;

import static lightning.mvc.Context.accessViolationIf;
import static lightning.mvc.Context.badRequestIf;
import static lightning.mvc.Context.db;
import static lightning.mvc.Context.session;
import static lightning.mvc.Context.user;
import static lightning.mvc.HTTPMethod.GET;
import static lightning.mvc.HTTPMethod.POST;

import java.sql.ResultSet;

import lightning.db.NamedPreparedStatement;
import lightning.mvc.Controller;
import lightning.mvc.Json;
import lightning.mvc.Lightning;
import lightning.mvc.QParam;
import lightning.mvc.RequireAuth;
import lightning.mvc.Route;

import org.riceapps.scheduleplanner.protocol.CourseIdMessage;
import org.riceapps.scheduleplanner.protocol.UserModelMessage;
import org.riceapps.scheduleplanner.protocol.UserModelPushMessage;

import com.google.common.collect.ImmutableMap;
import com.google.gson.FieldNamingPolicy;

@Controller
public class UserAPIController {
  @Route(path="/api/user", methods={GET})
  @RequireAuth
  @Json(prefix="')]}\n", names=FieldNamingPolicy.IDENTITY)
  public Object handleFetchUser() throws Exception {
    UserModelMessage message = new UserModelMessage();
    message.userId = user().getId();
    message.userName = user().getUserName();
    message.xsrfToken = session().newXSRFToken();
    message.hasAgreedToDisclaimer = user().hasProperty("HAS_AGREED_TO_DISCLAIMER")
        ? user().getBoolean("HAS_AGREED_TO_DISCLAIMER")
        : false;
    message.hasSeenTour = user().hasProperty("HAS_SEEN_TOUR")
        ? user().getBoolean("HAS_SEEN_TOUR")
        : false;
    message.lastSeenVersion = user().hasProperty("LAST_SEEN_VERSION")
        ? user().getInt("LAST_SEEN_VERSION")
        : 0;
        
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
  @RequireAuth
  @Json
  public Object handleUserPush(@QParam("_proto") String data) throws Exception {
    UserModelPushMessage request = Lightning.newGson(FieldNamingPolicy.IDENTITY).create().fromJson(data, UserModelPushMessage.class);
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
