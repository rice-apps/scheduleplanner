package org.riceapps.scheduleplanner.controllers;

import static lightning.enums.HTTPMethod.GET;
import static lightning.server.Context.isLoggedIn;
import static lightning.server.Context.user;

import java.util.Map;

import lightning.ann.Controller;
import lightning.ann.Route;
import lightning.ann.Template;

import com.google.common.collect.ImmutableMap;

@Controller
public class MainController {
  @Route(path="/", methods={GET})
  @Template("development.ftl") // TODO: An option to use production.ftl
  public Map<String, ?> handleIndex() throws Exception {
    if (isLoggedIn()) {
      return ImmutableMap.of("username", user().getUserName());
    } else {
      return ImmutableMap.of();
    }
  }
}
