(function() {
    'use strict';

    angular
        .module('app')
        .factory('MainService', MainService); // https://docs.angularjs.org/guide/services

    MainService.$inject = ['$http', '$log', '$q']; // https://github.com/johnpapa/angular-styleguide/tree/master/a1#manual-annotating-for-dependency-injection

    /* @ngInject */
    function MainService($http, $log, $q) {


    }
})();
