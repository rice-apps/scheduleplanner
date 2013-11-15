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
    }
);