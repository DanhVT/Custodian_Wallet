(function(window, angular, undefined) {
    "use strict";

    var MODULE_NAME = 'quanta.default',
        ngModule = angular.module(MODULE_NAME);

    ngModule.service('defaultService', ['$state', defaultService]);

    function defaultService($state) {

        var self = this;

        self.start = function() {

            console.log('defaultService started');

            $state.go('language');

        }

        self.start();

    }

})(window, window.angular);