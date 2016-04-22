package org.riceapps.scheduleplanner;

import lightning.ann.Optional;
import lightning.config.Config;

public class SchedulePlannerConfig extends Config {
  public static final String XSSI_PREFIX = "')]}\n";
  
  // Whether to use the production view or the development view.
  // Production view uses the pre-compiled JavaScript binary (via build_prod.sh).
  // Development uses the raw JavaScript files (via build_dev.sh). This is slower than the
  // production bundle, but gives instant-refresh development.
  public @Optional boolean useProductionView = false;
}
