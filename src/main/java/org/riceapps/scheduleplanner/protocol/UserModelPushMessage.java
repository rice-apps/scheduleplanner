package org.riceapps.scheduleplanner.protocol;

public final class UserModelPushMessage {
  public int userId;
  public String xsrfToken;
  public boolean hasSeenTour;
  public boolean hasAgreedToDisclaimer;
  public int lastSeenVersion;
  public PlaygroundMessage playground;
  public ScheduleMessage schedule;
}
