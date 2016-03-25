package org.riceapps.scheduleplanner.db;

public enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY;
  
  public String xmlRep() {
    switch (this) {
      case FRIDAY: return "FRI_DAY";
      case MONDAY: return "MON_DAY";
      case SATURDAY: return "SAT_DAY";
      case SUNDAY: return "SUN_DAY";
      case THURSDAY: return "THU_DAY";
      case TUESDAY: return "TUE_DAY";
      case WEDNESDAY: return "WED_DAY";      
      default: throw new IllegalStateException();
    }
  }
}
