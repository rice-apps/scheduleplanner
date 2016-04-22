package org.riceapps.scheduleplanner.controllers;

import static lightning.enums.HTTPMethod.GET;

import java.io.File;

import lightning.ann.Route;

import org.riceapps.scheduleplanner.cache.CourseCache;

public class CourseAPIController extends AbstractController {
  @Route(path="/api/courses", methods={GET})
  public File handleFetchCourses() throws Exception {
    return CourseCache.get();
  }
}
