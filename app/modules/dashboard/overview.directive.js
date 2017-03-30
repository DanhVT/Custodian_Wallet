(function(window, angular, undefined) {
    "use strict";

    var MODULE_NAME = 'quanta.dashboard',
        ngModule = angular.module(MODULE_NAME);

    ngModule.directive('overviewTotal', function() {
        return {
            restrict: 'E',
            //replace: true,
            templateUrl: 'modules/dashboard/templates/total.html',
            link: function($scope, element, attr) {}
        };
    });

    ngModule.directive('autofocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $timeout(function() {
                    $element[0].focus();
                });
            }
        }
    }]);

})(window, window.angular);