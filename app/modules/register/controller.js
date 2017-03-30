(function(window, angular, undefined) {
    "use strict";

    var UtilsExt = window.UtilsExt;

    var MODULE_NAME = 'quanta.register',
        ngModule = angular.module(MODULE_NAME);

    ngModule.controller('registerController', ['$rootScope', '$scope', '$window', '$state', registerController]);

    function registerController($rootScope, $scope, $window, $state, $stateParams) {
        var self = this,
            osLang = Utils.getOsLanguage();

        $rootScope.lang = $scope.lang = allLang[osLang];
        $scope.isBack = false;

        SettingUtils.getSetting('defaultLanguage', function(err, userLang) {
            if (!err && typeof userLang == "string" && userLang.length > 0) {
                $rootScope.lang = $scope.lang = allLang[userLang];
                if (typeof WalletUtils.cache.listWalletModel != 'undefined' && WalletUtils.cache.listWalletModel != null && WalletUtils.cache.listWalletModel.length > 0)
                    $scope.isBack = true;
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                    $scope.$apply();
                }
            }
        });

        $scope.onInit = function() {
            $rootScope.passPhrase = ''; // Must reset, in case create/restore wallet twice or more

            if (typeof hideLoadingAnimation == "function") {
                hideLoadingAnimation();
            }
        }

        $scope.onCreateWallet = function() {

            $state.go('register.inputPassphrase', { createNew: true });
        }

        $scope.onRestoreWallet = function() {

            $state.go('register.inputPassphrase');
        }

        $scope.onBack = function() {
            $state.go('dashboard');
        }
    }

})(window, window.angular);