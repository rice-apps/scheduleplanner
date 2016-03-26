package org.riceapps.scheduleplanner;

import java.io.File;
import java.io.FileInputStream;

import org.apache.commons.io.IOUtils;

import lightning.config.Config;
import lightning.json.JsonFactory;

public class ConfigFactory {
  public static Config make(File file) throws Exception {
    return JsonFactory.newJsonParser().fromJson(IOUtils.toString(new FileInputStream(file)), SchedulePlannerConfig.class);
  }
}
