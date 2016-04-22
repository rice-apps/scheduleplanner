package org.riceapps.scheduleplanner.controllers;

import static lightning.enums.HTTPMethod.GET;
import static lightning.server.Context.*;

import java.util.Map;

import lightning.ann.Route;
import lightning.ann.Template;

import com.google.common.collect.ImmutableMap;

public class MainController extends AbstractController {
  @Route(path="/", methods={GET})
  @Template
  public void handleIndex() throws Exception {
    String template = config.useProductionView 
        ? "production.ftl" 
        : "development.ftl";   
    render(template, buildViewModel());
  }
  
  protected Map<String, ?> buildViewModel() throws Exception {
    if (isLoggedIn()) {
      return ImmutableMap.of("username", user().getUserName());
    } else {
      return ImmutableMap.of();
    }
  }
}
