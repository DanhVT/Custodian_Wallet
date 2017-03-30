(function(window, angular, undefined) {
    "use strict";

    var UtilsExt = window.UtilsExt;

    var MODULE_NAME = 'quanta.languages',
        ngModule = angular.module(MODULE_NAME);

    ngModule.controller('languagePageController', ['$rootScope', '$scope', '$state', '$timeout', 'updateVersionService', languagePageController]);
    ngModule.controller('languageTermControllers', ['$rootScope', '$scope', '$state', 'updateVersionService', languageTermController]);
    ngModule.controller('languageTermController', ['$rootScope', '$scope', '$state', languageTermController]);

    function languagePageController($rootScope, $scope, $state, $timeout, updateVersionService) {
        $scope.onInitView = function() {
            console.log($state.current.name);
            $timeout(function() {
                SettingUtils.getSetting('defaultLanguage', function(err, data) {
                    if (!err && data != null) {
                        SettingUtils.getSetting('isTermsAgreed', function(err, isTermsAgreed) {
                            if (!(typeof isTermsAgreed == "boolean" && isTermsAgreed === true)) {
                                $state.go(Configs.pages.termsPage);
                                return;
                            }
                            $state.go('register');
                        });
                    } else {
                        if ($state.current.name == 'languages') {
                            $timeout(function() {
                                $state.go("languages.select");
                            }, 1);
                        }
                    }
                    //hideLoadingAnimation(); 
                });
            });
        }
    }

    function languageTermController($rootScope, $scope, $state, updateVersionService) {
        var osLang = Utils.getOsLanguage();
        //showLoadingAnimation(); 
        $scope.lang = $rootScope.lang = allLang[osLang];
        $scope.url = 'modules/languages/templates/term-' + $scope.lang.code + '.html';
        SettingUtils.getSetting('defaultLanguage', function(err, data) {
            if (!err && data != null) {
                $scope.code = data;
                $scope.lang = $rootScope.lang = allLang[data];
                $scope.url = 'modules/languages/templates/term-' + $scope.lang.code + '.html';
                if (!$scope.$$phase)
                    $scope.$apply();
            }
            hideLoadingAnimation();
        })

        $scope.onNext = function() {
            SettingUtils.updateSetting('isTermsAgreed', $scope.read, function(err) {
                $state.go('dashboard');
            });
        }
    }

})(window, window.angular);