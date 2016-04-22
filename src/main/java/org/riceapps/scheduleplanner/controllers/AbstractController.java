package org.riceapps.scheduleplanner.controllers;

import org.riceapps.scheduleplanner.SchedulePlannerConfig;

import lightning.ann.Controller;
import lightning.ann.Initializer;

@Controller
public abstract class AbstractController {
  protected SchedulePlannerConfig config;
  
  @Initializer
  public final void init(SchedulePlannerConfig config) {
    this.config = config;
  }
}
