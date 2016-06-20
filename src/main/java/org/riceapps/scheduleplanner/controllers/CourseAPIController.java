package org.riceapps.scheduleplanner.controllers;

import static lightning.enums.HTTPMethod.GET;
import static lightning.server.Context.*;

import java.io.File;

import lightning.ann.Route;

import org.riceapps.scheduleplanner.cache.CourseCache;

public class CourseAPIController extends AbstractController {
  @Route(path="/api/courses", methods={GET})
  public File handleFetchCourses() throws Exception {
    File cachedData = CourseCache.get();
    
    // If you get this, you need to re-sync course data with courses.rice.edu to build
    // a cache of course data. Run org.riceapps.scheduleplanner.Parser.
    illegalStateIf(!cachedData.exists() || !cachedData.canRead(), 
        "No course data found - re-run the course data synchronizer.");
    
    return cachedData;
  }
}
