package org.riceapps.scheduleplanner;

import java.io.File;
import java.io.FileInputStream;

import lightning.Lightning;
import lightning.config.Config;
import spark.utils.IOUtils;

public class ConfigFactory {
  public static Config make(File file) throws Exception {
    return Lightning.newGson().create().fromJson(IOUtils.toString(new FileInputStream(file)), SchedulePlannerConfig.class);
  }
}
