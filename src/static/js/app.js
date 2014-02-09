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
var coursename_to_cells = {};

app.directive('draggable', function () {
    return function (scope, element) {
        // this gives us the native JS object
        var el = element[0];

        el.draggable = true;

        el.addEventListener(
            'dragstart',
            function (e) {
                draggedCourse = this;
                return false;
            },
            false
        );

        el.addEventListener(
            'dragend',
            function (e) {
                draggedCourse = undefined;
                return false;
            },
            false
        );
    };
});


// TODO
/* set up search box filter */
$('#search-courses').bind("keyup", function(e){
    var search_term = this.value;
    $("#course-list div").each(function(i, v){
        var coursename = v.innerHTML;
        var isPossResult = coursename.toLowerCase().search(search_term) != -1;
        if(!isPossResult) {
            $(v).hide();
        } else {
            $(v).show();
        }
    });
});


/**
 * Add droppable callbacks to all droppable elements
 */
app.directive('droppable', function () {
    return {
        link: function (scope, element) {
            // again we need the native object
            var el = element[0];

            var isHighlighted = false;

            el.droppable = true;

            /* highlight element when dragged over */
            el.addEventListener(
                'dragover',
                function (e) {
                    if (e.preventDefault) e.preventDefault(); // allows us to drop
                    if (!isHighlighted) {
                        this.classList.add('over');
                        e.dataTransfer.dropEffect = 'copy';
                    }
                    return false;
                },
                false
            );

            /* unhighlight on leave */
            el.addEventListener(
                'dragleave',
                function (e) {
                    this.classList.remove('over');
                },
                false
            );


            /* on drop callback */
            var droppableCallbacks = {
                "calendar": function (e) {
                    if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
                    var HOUR_HEIGHT = $("#calendar td").first().outerHeight();
                    var calendar = this;
                    var trash = document.getElementById("trash");

                    /* remove highlighting */
                    this.classList.remove('over');

                    // TODO
                    // get course name, not a dummy
                    /* get course name */
                    var coursename = draggedCourse.attributes["name"].firstChild.data;
                    coursename_to_cells[coursename] = [];
                    

                    // TODO 
                    // get coursetimes, not a dummy
                    /* get course time object */
                    var coursetimes = scope.course_to_coursetime[coursename];

                    /* loop through and fill in cells in the calendar according to the course times */
                    for (var i = 0; i < coursetimes.length; i++) {
                        /* get the appropriate time cell to append to */
                        var ctime = coursetimes[i];
                        var tcell_id = ctime["day"] + "-" + (ctime["time_start"] / 60);
                        var tcell = document.getElementById(tcell_id);

                        /* create a div for this course time */
                        var coursetime_div = document.createElement('div');
                        coursetime_div.innerHTML = coursename;
                        coursetime_div.style.position = "absolute";
                        coursetime_div.style.top = "-3px";
                        coursetime_div.style["z-index"] = "1";
                        coursetime_div.classList.add("course");

                        /* set the height of the div based on the length of the course */
                        var course_duration = (ctime["time_end"] - ctime["time_start"]) / 60 * HOUR_HEIGHT;

                        coursetime_div.style.height = (course_duration) + "px";

                        /* save the course time divs for deletion purposes later */
                        coursename_to_cells[coursename].push(coursetime_div);


                        tcell.appendChild(coursetime_div);



                        /* define cell drag events */
                        coursetime_div.draggable = true;
                        coursetime_div.addEventListener(
                            'dragstart',
                            function (e) {
                                trash.classList.remove("opaque");
                                draggedCourse = coursename;
                                calendar.classList.add('opaque');
                                return false;
                            },
                            false
                        );
                        coursetime_div.addEventListener(
                            'dragend',
                            function (e) {
                                // trash.classList.add("hide");
                                trash.classList.add("opaque");
                                calendar.classList.remove('opaque');
                                return false;
                            },
                            false
                        );


                    }

                    return false;
                },

                "trash": function (e) {
                    var cells_to_delete = coursename_to_cells[draggedCourse];
                    for(var i = 0; i < cells_to_delete.length; i++) {
                        cells_to_delete[i].remove();
                    }
                }
            };




            el.addEventListener(
                'drop',
                droppableCallbacks[el.id],
                false
            );


        }
    };
});
