package org.riceapps.scheduleplanner.controllers;

import java.util.Map;

import com.google.common.collect.ImmutableMap;

import lightning.mvc.*;
import static lightning.Context.*;
import static lightning.mvc.HTTPMethod.*;

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
