'use strict';

var app = angular.module('schedulePlanner', []);
app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });