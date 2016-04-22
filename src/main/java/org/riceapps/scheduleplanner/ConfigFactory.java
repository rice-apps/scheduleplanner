package org.riceapps.scheduleplanner;

import java.io.File;
import java.io.FileInputStream;

import lightning.json.JsonFactory;

import org.apache.commons.io.IOUtils;

public class ConfigFactory {
  public static SchedulePlannerConfig make(File file) throws Exception {
    return JsonFactory.newJsonParser().fromJson(
        IOUtils.toString(new FileInputStream(file)), 
        SchedulePlannerConfig.class);
  }
}
