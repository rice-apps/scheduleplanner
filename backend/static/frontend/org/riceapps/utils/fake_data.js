goog.provide('org.riceapps.utils.FakeData');

goog.require('org.riceapps.models.CourseModel');

/**
 * @param {number} count
 * @return {!Array.<!org.riceapps.models.CourseModel>}
 */
org.riceapps.utils.FakeData.getCourseModels = function(count) {
  var models = [];
  /*
  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 0,
        "start" : 9,
        "end" : 11,
        "location" : 'RZR 121'
      }, {
        "day" : 2,
        "start" : 9,
        "end" : 11,
        "location" : 'RZR 121'
      }, {
        "day" : 4,
        "start" : 9,
        "end" : 11,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);

  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 0,
        "start" : 11,
        "end" : 12,
        "location" : 'RZR 121'
      }, {
        "day" : 2,
        "start" : 11,
        "end" : 12,
        "location" : 'RZR 121'
      }, {
        "day" : 4,
        "start" : 11,
        "end" : 12,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);

  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 0,
        "start" : 10,
        "end" : 12,
        "location" : 'RZR 121'
      }, {
        "day" : 2,
        "start" : 10,
        "end" : 12,
        "location" : 'RZR 121'
      }, {
        "day" : 4,
        "start" : 10,
        "end" : 12,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);

  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 0,
        "start" : 16,
        "end" : 17,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);

  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 0,
        "start" : 9,
        "end" : 15,
        "location" : 'RZR 121'
      }, {
        "day" : 4,
        "start" : 9,
        "end" : 15,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);

  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 0,
        "start" : 8,
        "end" : 11,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);

  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 1,
        "start" : 11,
        "end" : 13.5,
        "location" : 'RZR 121'
      }, {
        "day" : 3,
        "start" : 11,
        "end" : 13.5,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);

  var model = new org.riceapps.models.CourseModel();
  model.getMeetingTimes = function() {
    return [{
        "day" : 1,
        "start" : 13.5,
        "end" : 15,
        "location" : 'RZR 121'
      }, {
        "day" : 3,
        "start" : 13.5,
        "end" : 15,
        "location" : 'RZR 121'
      }];
  };
  models.push(model);
  */

  return models;
};
