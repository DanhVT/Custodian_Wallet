(function(window, angular, undefined) {
    "use strict";

    var ProcessUtils = window.ProcessUtils;

    var MODULE_NAME = 'quanta.dashboard',
        ngModule = angular.module(MODULE_NAME);
    ngModule.service('dashboardService', ['$state', '$mdDialog', dashboardService]);

    function dashboardService($state, $mdDialog) {};

})(window, window.angular);