package org.riceapps.scheduleplanner.protocol;

public class UserModelMessage {
  public long userId;
  public String userName;
  public String xsrfToken;
  public boolean hasSeenTour;
  public boolean hasAgreedToDisclaimer;
  public int lastSeenVersion;
  public PlaygroundMessage playground;
  public ScheduleMessage schedule;
  
  public UserModelMessage() {
    playground = new PlaygroundMessage();
    schedule = new ScheduleMessage();
  }
}
