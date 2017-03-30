(function(window, angular, undefined) {
    "use strict";

    var UtilsExt = window.UtilsExt;

    var MODULE_NAME = 'quanta.default',
        ngModule = angular.module(MODULE_NAME);

    ngModule.controller('defaultController', ['$scope', '$window', 'defaultService', defaultController]);

    function defaultController($scope, $window, defaultService) {

        var self = this;

        self.lang = Utils.getOsLanguage();

        $scope.lang = allLang[self.lang];

        SettingUtils.getSetting('defaultLanguage', function(err, userLang) {
            if (!err && typeof userLang == "string" && userLang.length > 0) {
                self.lang = userLang;
            }
            $scope.lang = allLang[self.lang];
        });

        $scope.onCloseWindow = function() {
            UtilsExt.closeWindow();
        }

        $scope.onMinimizeWindow = function() {
            UtilsExt.minimizeWindow();
        }

    }

})(window, window.angular);