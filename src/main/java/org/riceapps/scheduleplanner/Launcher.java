package org.riceapps.scheduleplanner;

import lightning.Lightning;
import lightning.config.Config;
import lightning.util.Flags;

/**
 * Run this program to launch the webserver hosting scheduleplanner.
 * 
 * Options:
 *   --config <file>:   (REQUIRED) Specifies the location of the JSON-formatted config file.
 *                                 See SchedulePlannerConfig and its inheritence tree for structure.
 *                                 Template is provided in src/main/resources.
 *   --debug:           (OPTIONAL) Overrides the config option to enable debug mode if present.
 */
public class Launcher {
  public static void main(String[] args) throws Exception {
    Flags.parse(args);    
    Config config = ConfigFactory.make(Flags.getFile("config"));
    
    if (Flags.has("debug")) {
      config.enableDebugMode = true;
    }
    
    Lightning.launch(config);
  }
}
