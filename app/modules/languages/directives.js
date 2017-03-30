(function(window, angular, undefined) {
    "use strict";

    var SettingUtils = window.SettingUtils;

    var MODULE_NAME = 'quanta.languages',
        ngModule = angular.module(MODULE_NAME);

    ngModule.directive('languagePackages', [languagePackages]);
    ngModule.controller('languagePackagesController', ['$rootScope', '$scope', '$window', '$state', languagePackagesController]);

    ngModule.directive('languagePage', [languagePage]);

    function languagePage() {
        return {
            restrict: 'EC',
            templateUrl: "modules/languages/templates/language-page.html",
            replace: true,
            link: function(scope, element, attrs) {},
        };
    }

    function languagePackages() {
        return {
            restrict: 'EC',
            templateUrl: "modules/languages/templates/index.html",
            replace: true,
            link: function(scope, element, attrs) {},
        };
    }

    function languagePackagesController($rootScope, $scope, $window, $state) {
        var self = $scope,
            osLang = Utils.getOsLanguage();
        self.langs = [];
        //showLoadingAnimation();
        $rootScope.lang = $scope.lang = allLang[osLang];
        $scope.code = $scope.lang.code;

        for (var i = 0; i < Configs.langCodeList.length; i++) {
            var code = Configs.langCodeList[i];
            if (typeof allLang[osLang]['selectLanguages'] != "undefined" && typeof allLang[osLang]['selectLanguages'][code] != "undefined") {
                self.langs.push({
                    name: eval('$scope.lang.selectLanguages.' + code),
                    code: code
                });
            }
        }

        SettingUtils.getSetting('defaultLanguage', function(err, data) {
            if (!err && data != null) {
                $scope.code = data;
                $scope.lang = $rootScope.lang = allLang[data];
                if (!$scope.$$phase)
                    $scope.$apply();
            }
            hideLoadingAnimation();
        })


        self.onChange = function(code) {
            $rootScope.lang = $scope.lang = allLang[code];
        }
        self.onNext = function() {
            $rootScope.lang = $scope.lang = allLang[$scope.code];
            SettingUtils.updateSetting('defaultLanguage', $scope.code, function(err) {
                $state.go('languages.termpage');
            });
        }

        self.onCloseWindow = function() {
            UtilsExt.closeWindow();
        }

        self.onMinimizeWindow = function() {
            UtilsExt.minimizeWindow();
        }
    }

})(window, window.angular);