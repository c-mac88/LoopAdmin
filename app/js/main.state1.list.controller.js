(function() {
    'use strict';

    angular
        .module('app')
        .controller('State1ListController', State1ListController);

    State1ListController.$inject = ['MainService', '$stateParams'];



    /* @ngInject */
    function State1ListController(MainService, $stateParams) {


    }
})();
