'use strict'

angular.module('schedulePlanner').controller('MainCtrl', 
    function ($scope, $location, filterFilter) {

      $scope.courses = [
        "ANTH 100",
        "ANTH 200",
        "ANTH 300"
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

      $scope.course_to_coursetime = {
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
        ],
        "ANTH 200" : [
          {
            "time_start": 720,
            "day": 2,
            "time_end": 780
          },
          {
            "time_start": 600,
            "day": 3,
            "time_end": 660
          }
        ],
        "ANTH 300" : [
          {
            "time_start": 600,
            "day": 4,
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

      //window.scope = $scope;
    }
);
