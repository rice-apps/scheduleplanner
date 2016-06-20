package org.riceapps.scheduleplanner;

import lightning.Lightning;
import lightning.inject.InjectorModule;
import lightning.plugins.cas.ann.CASDomain;
import lightning.plugins.cas.ann.CASHost;
import lightning.plugins.cas.ann.CASPath;
import lightning.util.Flags;

/**
 * Run this program to launch the webserver hosting scheduleplanner.
 * 
 * Options:
 *   --config <file>:   (REQUIRED) Specifies the location of the JSON-formatted config file.
 *                                 See SchedulePlannerConfig and its inheritance tree for structure.
 *                                 Template is provided in src/main/resources.
 *   --debug:           (OPTIONAL) Overrides the config option to enable debug mode if present.
 */
public class Launcher {
  public static void main(String[] args) throws Exception {
    // Parse the command line flags.
    Flags.parse(args);    
    
    // Parse the configuration from the file specified by command line flags.
    SchedulePlannerConfig config = ConfigFactory.make(Flags.getFile("config"));
    
    // Allow command-line override to enable debug mode.
    if (Flags.has("debug")) {
      config.enableDebugMode = true;
      config.useProductionView = false;
    }
    
    // Set up dependency injection.
    InjectorModule injector = new InjectorModule();
    
    injector.bindClassToInstance(SchedulePlannerConfig.class, config);
    injector.bindAnnotationToInstance(CASHost.class, "netid.rice.edu");
    injector.bindAnnotationToInstance(CASPath.class, "/cas");
    injector.bindAnnotationToInstance(CASDomain.class, "@rice.edu");
    
    // Launch the web server.
    Lightning.launch(config, injector);
  }
}
