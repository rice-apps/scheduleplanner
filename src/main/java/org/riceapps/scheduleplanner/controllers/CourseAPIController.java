package org.riceapps.scheduleplanner.controllers;

import static lightning.mvc.Context.sendFile;
import static lightning.mvc.HTTPMethod.GET;
import lightning.mvc.Controller;
import lightning.mvc.Route;

import org.riceapps.scheduleplanner.cache.CourseCache;

@Controller
public class CourseAPIController {
  @Route(path="/api/courses", methods={GET})
  public Object handleFetchCourses() throws Exception {
    return sendFile(CourseCache.get());
  }
}
