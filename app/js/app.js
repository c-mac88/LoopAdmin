(function() {
    'use strict';

    // define top-level module container
    var app = angular.module('app', ['ui.router']);

    // additional configuration goes here

    app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
        //
        $httpProvider.interceptors.push('mashapeHttpInterceptor');
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/main");
        //
        // Now set up the states
        $stateProvider
            .state('main', {
                url: "/main",
                templateUrl: "app/partials/main.html",
                controller: "MainController"

            })
            .state('main.state1', {
                url: "/state1",
                templateUrl: "app/partials/main.state1.html",
                controller: "State1Controller"
            })
            .state('main.state1.list', {
                url: "/list/:deaths?country?number?location?narrative?link?day?month?year",
                templateUrl: "app/partials/state1.list.html",
                controller: "State1ListController"
            })

        .state('main.state2', {
            url: "/state2/:deaths?country",
            templateUrl: "app/partials/main.state2.html"
        })

    })

    app.run(function() {
        Parse.initialize("2cc7c323bdc48c1765d8d8d05e27d720");
        Parse.serverURL = "http://cryptic-escarpment-48353.herokuapp.com/parse";
    })

})();
