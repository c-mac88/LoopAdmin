(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope'];

    /* @ngInject */
    function MainController($scope) {

        $scope.First = "";
        $scope.Last = "";
        Parse.User.logIn("christian@test.com", "password123", {
            success: function(user) {
                console.log(user);
                nextFunction();
            },
            error: function() {
                console.log("err" + err);
            }
        });

        var nextFunction = function() {
            $scope.$apply(function() {
                $scope.First = Parse.User.current().get('FirstName');
                $scope.Last = Parse.User.current().get('LastName');
            })

        };
    };


})();
