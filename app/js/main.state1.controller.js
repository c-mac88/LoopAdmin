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
            $('#calendar').fullCalendar('destroy');
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
                events: []

            });

            $scope.looperSelected = selected;
            var looperQuery = new Parse.Query('User');
            looperQuery.equalTo('DisplyName', selected);
            looperQuery.find({
                success: function(data) {
                    console.log(data[0]);
                    getEvents(data[0]);
                },
                error: function(err) {
                    console.log("err" + err);
                }
            })
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
                events: []

            });

        });


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


        var getEvents = function(selectedUserId) {
            var query = new Parse.Query("Task");
            query.equalTo('user', selectedUserId);
            query.find({
                success: function(object) {
                    nextFunction(object);
                },
                error: function(err) {
                    console.log(err);
                }
            });
        };

        var nextFunction = function(sneeze) {
            var theseEvents = [];

            for (var i = 0; i < sneeze.length; i++) {
                var newEvent = {
                    "startsAtDate": "",
                    "eventname": "",
                    "starthour": "",
                    "endhour": "",
                    "address": "",
                    "memo": ""
                };
                var startsAtDate = sneeze[i].get('startsAtDate');
                var eventname = sneeze[i].get('eventname');
                var starthour = sneeze[i].get('starthour');
                var endhour = sneeze[i].get('endhour');
                var address = sneeze[i].get('address');
                var memo = sneeze[i].get('memo');

                newEvent.startsAtDate = startsAtDate;
                newEvent.eventname = eventname;
                newEvent.starthour = parseInt(starthour.substr(0, 2));
                newEvent.endhour = endhour;
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
            var stuff = things;
            var calendar = $('#calendar');
            for (var i = 0; i < stuff.length; i++) {
                var starthour = "";
                var newnew = {
                    "title": "",
                    "start": "",
                };
                if (stuff[i].starthour < 10) {
                    starthour = "0" + stuff[i].starthour + ":00";
                } else {
                    starthour = stuff[i].starthour += ":00";
                };
                newnew.start = new Date(stuff[i].startsAtDate);
                newnew.title = stuff[i].eventname + "," + starthour + "-" + stuff[i].endhour + "," + stuff[i].address + "," + stuff[i].memo;
                calendar.fullCalendar('renderEvent', {
                        title: newnew.title,
                        start: newnew.start
                    },
                    true // make the event "stick"
                );
            }

        }
    }
})();
