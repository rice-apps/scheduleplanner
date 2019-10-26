package org.riceapps.scheduleplanner.controllers;

import static lightning.enums.HTTPMethod.GET;
import static lightning.server.Context.isLoggedIn;
import static lightning.server.Context.render;
import static lightning.server.Context.user;
import java.util.Map;
import com.google.common.collect.ImmutableMap;
import lightning.ann.Route;

public class MainController extends AbstractController {
  @Route(path="/", methods={GET})
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
