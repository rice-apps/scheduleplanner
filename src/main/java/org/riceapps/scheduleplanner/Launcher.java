package org.riceapps.scheduleplanner;

import lightning.cache.Cache;
import lightning.cache.driver.InMemoryCacheDriver;
import lightning.mvc.Lightning;
import lightning.util.Flags;

public class Launcher {
  public static void main(String[] args) throws Exception {
    Flags.parse(args);    
    Cache.setDriver(new InMemoryCacheDriver());
    Lightning.launch(ConfigFactory.make());
  }
}
