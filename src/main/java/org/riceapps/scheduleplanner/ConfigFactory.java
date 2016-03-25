package org.riceapps.scheduleplanner;

import lightning.config.Config;
import lightning.util.Flags;

import com.google.common.collect.ImmutableList;

public class ConfigFactory {
  public static Config make() {
    return Config.newBuilder()
        .setEnableDebugMode(Flags.has("debug"))
        .setAutoReloadPrefixes(ImmutableList.of(
            "org.riceapps.scheduleplanner"
        ))
        .setScanPrefixes(ImmutableList.of(
            "org.riceapps.scheduleplanner",
            "lightning.examples.cas"
        ))
        .server.setThreads(250)
        .server.setPort(80)
        .server.setHmacKey(Flags.getStringOption("hmac-key").or("default"))
        .server.setStaticFilesPath("org/riceapps/scheduleplanner/assets")
        .server.setTemplateFilesPath("org/riceapps/scheduleplanner/templates")
        .db.setHost("localhost")
        .db.setPort(3306)
        .db.setUsername("httpd")
        .db.setPassword("httpd")
        .db.setName("scheduleplannerjava")
        .mail.setAddress("donotreply@riceapps.org")
        .mail.setHost("smtp.riceapps.org")
        .mail.setPort(465)
        .mail.setUseSSL(true)
        .mail.setUsername("donotreply@riceapps.org")
        .mail.setPassword("todo")
        .build();
  }
}
