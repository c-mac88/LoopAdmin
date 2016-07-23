(function() {
    'use strict';

    angular
        .module('app')
        .controller('State1Controller', State1Controller);

    State1Controller.$inject = ['$scope'];



    /* @ngInject */
    function State1Controller($scope) {

        $scope.looperSelected = "";

        $scope.selectLooper = function(selected) {
            $scope.looperSelected = selected;
            var currentDate = $('#calendar').fullCalendar('getDate');
            $scope.currentDate = currentDate.toString().substr(0, 15);
            console.log($scope.currentDate);
            getEvents();
        };


        $scope.theseLoopers = [];
        var query = new Parse.Query('User');
        query.find({
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var First = data[i].get('FirstName');
                    var Last = data[i].get('LastName');
                    var Display = data[i].get('DisplyName');
                    $scope.theseLoopers.push({ "First": First, "Last": Last, "Display": Display });
                }
                console.log($scope.theseLoopers);
            },
            error: function(err) {
                console.log("err" + err);
            }
        })

        $(function() {
            // Easy pie charts
            var calendar = $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                selectable: true,
                selectHelper: true,
                select: function(start, end, allDay) {
                    var title = prompt('Event Title:');
                    if (title) {
                        calendar.fullCalendar('renderEvent', {
                                title: title,
                                start: start,
                                end: end,
                                allDay: allDay
                            },
                            true // make the event "stick"
                        );
                    }
                    calendar.fullCalendar('unselect');
                },
                droppable: true, // this allows things to be dropped onto the calendar !!!
                drop: function(date, allDay) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                    // is the "remove after drop" checkbox checked?
                    if ($('#drop-remove').is(':checked')) {
                        // if so, remove the element from the "Draggable Events" list
                        $(this).remove();
                    }

                },
                editable: true,
                // US Holidays
                events: 'https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic'

            });

        });

        var currentDate = $('#calendar').fullCalendar('getDate');
        $scope.currentDate = currentDate.toString().substr(0, 15);


        $('#external-events div.external-event').each(function() {

            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999999999,
                revert: true, // will cause the event to go back to its
                revertDuration: 0 //  original position after the drag
            });

        });

        var getEvents = function() {
            $scope.theseEvents = [];
            var query = new Parse.Query("Task");
            query.equalTo('startsAtDate', $scope.currentDate);
            query.find({
                success: function(object) {
                    nextFunction(object);
                },
                error: function(err) {
                    console.log(err);
                }
            });
        };

        getEvents();

        // $scope.homeStartHour = "7:00";
        // $scope.homeEndHour = "08:00";
        // $scope.homeEvent = {
        //     "location": Parse.User.current().get('Address'),
        //     "eventname": 'Home',
        //     "starthour": $scope.homeStartHour,
        //     "endhour": $scope.homeEndHour,
        //     "eventtype": "ion-home",
        //     "color": "rgba(0, 52, 102, .5)"
        // };

        var nextFunction = function(sneeze) {
            var theseEvents = [];

            for (var i = 0; i < sneeze.length; i++) {
                var newEvent = {
                    "startsAtDate": "",
                    "eventname": "",
                    "starthour": "",
                    "endhour": "",
                    "eventtype": "",
                    "left": "",
                    "top": "",
                    "height": "",
                    "color": "",
                    "dateformat": "",
                    "address": "",
                    "memo": ""
                };
                var startsAtDate = sneeze[i].get('startsAtDate');
                var eventname = sneeze[i].get('eventname');
                var starthour = sneeze[i].get('starthour');
                var endhour = sneeze[i].get('endhour');
                var color = sneeze[i].get('color');
                var address = sneeze[i].get('address');
                var memo = sneeze[i].get('memo');

                newEvent.startsAtDate = startsAtDate;
                newEvent.eventname = eventname;
                newEvent.starthour = parseInt(starthour.substr(0, 2));
                newEvent.endhour = endhour;
                newEvent.color = color;
                newEvent.address = address;
                newEvent.memo = memo;


                theseEvents.push(newEvent);
            }

            finalFunction(theseEvents);

        }

        var finalFunction = function(things) {
            things.sort(function(a, b) {
                return a.starthour - b.starthour
            });
            var letters = "ABCDEFGHIJK";
            var stuff = things;
            for (var i = 0; i < stuff.length; i++) {

                var newnew = {
                    "startsAtDate": "",
                    "eventname": "",
                    "starthour": "",
                    "endhour": "",
                    "left": "",
                    "top": "",
                    "height": "",
                    "color": "",
                    "dateformat": "",
                    "address": "",
                    "memo": "",
                    "letter": ""
                };
                newnew.startsAtDate = stuff[i].startsAtDate;
                var left = 60 + 'px';
                var top = ((stuff[i].starthour - 7) * 100) + 'px';
                var height = (parseInt(stuff[i].endhour.substr(0, 2)) - stuff[i].starthour) * 100 + 'px';
                newnew.eventname = stuff[i].eventname;
                if (stuff[i].starthour < 10) {
                    newnew.starthour = "0" + stuff[i].starthour + ":00";
                } else {
                    newnew.starthour = stuff[i].starthour += ":00";
                };
                newnew.endhour = stuff[i].endhour;
                newnew.left = left;
                newnew.top = top;
                newnew.height = height;
                newnew.color = stuff[i].color;
                newnew.dateformat = new Date(stuff[i].startsAtDate).toLocaleDateString();
                newnew.address = stuff[i].address;
                newnew.memo = stuff[i].memo;
                newnew.letter = letters.substr(i + 1, 1);

                $scope.$apply(function() {
                    $scope.theseEvents.push(newnew);

                });
                console.log($scope.theseEvents);

            }

        }
    }
})();
