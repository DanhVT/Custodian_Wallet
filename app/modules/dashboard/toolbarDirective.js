(function(window, angular, undefined) {
    "use strict";

    var MODULE_NAME = 'quanta.app.general',
        ngModule = angular.module(MODULE_NAME, []);

    ngModule.directive('toolbarDirective', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/dashboard/templates/toolbar-directive.html',
            link: function($scope, element, attr) {}
        };
    });

    ngModule.controller('toolbarController', ['$rootScope', '$scope', '$window', '$state', '$timeout', '$sanitize', '$mdDialog', toolbarController]);

    function toolbarController($rootScope, $scope, $window, $state, $timeout, $sanitize, $mdDialog) {
        $scope.onCloseWindow = function() {
            UtilsExt.closeWindow();
        }

        $scope.onMinimizeWindow = function() {
            UtilsExt.minimizeWindow();
        }
    }

})(window, window.angular);