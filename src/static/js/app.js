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


var draggedCourse;

app.directive('draggable', function() {
  return function(scope, element) {
      // this gives us the native JS object
      var el = element[0];

      el.draggable = true;

      el.addEventListener(
          'dragstart',
          function(e) {
              draggedCourse = this;
              return false;
          },
          false
      );

      el.addEventListener(
          'dragend',
          function(e) {
              draggedCourse = undefined;
              return false;
          },
          false
      );
  };
});

app.directive('droppable', function() {
    return {
        link: function(scope, element) {
            // again we need the native object
            var el = element[0];

            if(el.id == "calendar") {
            var calendarHighlighted = false;

            el.droppable = true;

            console.log(el);

            el.addEventListener(
              'dragover',
              function(e) {
                if (e.preventDefault) e.preventDefault(); // allows us to drop
                if(!calendarHighlighted) {
                  this.classList.add('over');
                  e.dataTransfer.dropEffect = 'copy';
                }
                return false;
              },
              false
            );

            el.addEventListener(
              'dragleave',
              function(e) {
                  this.classList.remove('over');
              },
              false
            );

            el.addEventListener(
                'drop',
                function(e) {
                    if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
                    var calendar = this;

                    this.classList.remove('over');

                    console.log(e);
                    // TODO
                    // get course name, not a dummy
                    var coursename = draggedCourse.attributes["name"].firstChild.data;

                    // TODO 
                    // get coursetime, not a dummy
                    var coursetime = scope.course_to_coursetime[coursename];
                    for(var i = 0; i < coursetime.length; i++) {
                      var tcell_id = coursetime[i]["day"] + "-" + (coursetime[i]["time_start"] / 60);
                      var tcell = document.getElementById(tcell_id);
                      var trash = document.getElementById("trash");
                      tcell.addEventListener(
                        'dragstart',
                        function(e) {
                          trash.classList.remove("hide");
                          calendar.classList.add('opaque');
                          return false;
                        },
                        false
                      );
                      tcell.addEventListener(
                        'dragend',
                        function(e) {
                          trash.classList.add("hide");
                          calendar.classList.remove('opaque');
                          return false;
                        },
                        false
                      );
                      tcell.innerHTML = coursename;
                      tcell.classList.add("course");
                      tcell.draggable = true;
                    }

                    return false;
                },
                false
            );

        }

      }
    };
});