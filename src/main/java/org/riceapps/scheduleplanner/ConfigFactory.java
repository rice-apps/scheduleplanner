package org.riceapps.scheduleplanner;

import java.io.File;
import java.io.FileInputStream;

import lightning.json.GsonFactory;

import org.apache.commons.io.IOUtils;

public class ConfigFactory {
  /**
   * Parses configuration from a JSON-formatted config file.
   * @param file
   * @return
   * @throws Exception
   */
  public static SchedulePlannerConfig make(File file) throws Exception {
    return GsonFactory.newJsonParser().fromJson(
        IOUtils.toString(new FileInputStream(file)), 
        SchedulePlannerConfig.class);
  }
}
