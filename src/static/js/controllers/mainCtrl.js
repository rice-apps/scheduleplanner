'use strict'

angular.module('schedulePlanner').controller('MainCtrl', 
    function ($scope, $location, filterFilter) {
      console.log("HERRRRROOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
      $scope.courses = [
        { 
          name: 'ANTH 100',
          start_time: 8,
          duration: 50,
        },
        { 
          name: 'ANTH 200',
          start_time: 8,
          duration: 50,
        },
        { 
          name: 'ANTH 300',
          start_time: 8,
          duration: 50,
        }
      ];

      $scope.hours = [
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
      ];

      var course_to_coursetime = {
        "ANTH 100" : [
          {
            "time_start": 480,
            "day": 1,
            "time_end": 600
          },
          {
            "time_start": 600,
            "day": 2,
            "time_end": 660
          }
        ]
      };

      $scope.days = [
        {
          name: 'Mon',
          acronym: '1'
        },
        {
          name: 'Tues',
          acronym: '2'
        },
        {
          name: 'Wed',
          acronym: '3'
        },
        {
          name: 'Thurs',
          acronym: '4'
        },
        {
          name: 'Fri',
          acronym: '5'
        }
      ];

      window.scope = $scope;
      
    }
);