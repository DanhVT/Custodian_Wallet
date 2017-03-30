(function(window, angular, $, undefined) {
    "use strict";
    var UtilsExt = window.UtilsExt;
    var WalletModel = window.WalletModel;
    var AngularUtils = window.AngularUtils;
    var MODULE_NAME = 'quanta.dashboard',
        ngModule = angular.module(MODULE_NAME);
    ngModule.controller('dashboardController', ['$rootScope', '$scope', '$window', '$state',
        '$timeout', '$mdToast', '$mdDialog', 'dashboardService', dashboardController
    ]);
    ngModule.controller('inputPassPhraseController', ['$rootScope', '$scope', '$window',
        '$state', '$mdDialog', '$timeout', 'type', inputPassPhraseController
    ]);

    function inputPassPhraseController($rootScope, $scope, $window, $state, $mdDialog, $timeout, type) {}

    function dashboardController($rootScope, $scope, $window, $state, $timeout, $mdToast, $mdDialog, dashboardService) {
        $rootScope.walletReady = false;

        $scope.$state = $state;

        $rootScope.walletUtilsCache = WalletUtils.cache;
        $scope.walletList = [];
        $scope.currentWallet = [];

        $scope.lang = [];

        function applyRootScope() {
            $timeout(function() {
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            });
        }

        $timeout(function() {
            $scope.lang = allLang['en'];
            if (!$scope.$$phase) {
                $scope.$apply();
            }

            if ($scope.isShowOptions === undefined) {
                $('#options').hide();
            }
        });
        $scope.onInit = function() {
            console.log("Danh1", landingPage)
            $timeout(function() {
                ProcessUtils.appStart(function(err, landingPage) {
                    console.log("Danh", landingPage)
                    if (!err) {
                        console.log('----------------------');
                        console.log('WalletUtils.cache: ', WalletUtils.cache);
                        console.log('----------------------');
                        if (typeof WalletUtils.cache.listWalletModel != 'undefined' && WalletUtils.cache.listWalletModel != null) {
                            for (var i = 0; i < WalletUtils.cache.listWalletModel.length; i++) {
                                WalletUtils.cache.listWalletModel[i].backup = false;
                            }
                            WalletUtils.cache.currentWallet.backup = false;
                        }
                        $scope.walletList = WalletUtils.cache.listWalletModel;
                        $scope.currentWallet = WalletUtils.cache.currentWallet;
                        console.log('landingPage ', landingPage);
                        //===================================================
                        if (landingPage == Configs.pages.dashBoardPage) {
                            var pattern = new RegExp(/^dashboard\./i);
                            console.log('$state.current.name', $state.current.name);
                            if (!pattern.test($state.current.name)) {
                                console.log(window.WalletUtils.cache);
                                $state.go(landingPage + '.balance');
                            }
                            $rootScope.walletReady = true;
                            if (!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }
                            hideLoadingAnimation();
                        } else {
                            hideLoadingAnimation();
                            $state.go(landingPage);
                        }
                    }
                })
            })
        }
        $scope.onChangeView = function($event, toState) {
                console.log($state);
                if ($state.current.name == toState) {

                } else if ($state.current.name == 'dashboard.backup' && angular.element('.stephead').length > 0) {
                    $mdDialog.show({
                            templateUrl: 'modules/dashboard/templates/backup/backupStop.html',
                            //targetEvent: ev,
                            clickOutsideToClose: false,
                            fullscreen: true,
                            parent: angular.element('body'),
                            locals: {

                            }
                        })
                        .then(function(next) {
                            if (next) {
                                $state.go(toState);
                            }
                        }, function() {

                        });
                } else {
                    var param = null;
                    if (toState == 'dashboard.backup') {
                        param = {
                            step: 0
                        }
                    }
                    $state.go(toState, param);
                }
            }
            // Get version from package.json
        $.getJSON('package.json').done(function(packageConfig) {
            if (typeof packageConfig != undefined && packageConfig) {
                $scope.version = 'ver ' + packageConfig.version;
            } else {
                $scope.version = '';
                console.error('CANNOT_GET_CLIENT_VERSION');
            }
        }).fail(function() {
            $scope.version = '';
            console.error('FAILED_TO_GET_CLIENT_VERSION');
        });
        if (!$rootScope.online) {
            showPopupNetworkErr('USER');
        }

        function showPopupNetworkErr(type) {
            if ($rootScope.isShowPopupNetworkErr)
                return;
            $rootScope.isShowPopupNetworkErr = true;
            $mdDialog.show({
                ariaLabel: 'inputPassPhraseController',
                templateUrl: 'modules/dashboard/templates/network-error.html',
                controller: inputPassPhraseController,
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: false,
                escapeToClose: true,
                skipHide: true,
                locals: {
                    type: type
                }
            }).then(function() {}, function() {});
        }

    }
    ngModule.run(function($window, $rootScope, $mdDialog) {
        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function() {
            AngularUtils.broadcast('NETWORK_ERROR');
        }, false);

        $window.addEventListener("online", function() {
            AngularUtils.broadcast('NETWORK_CONNECT');
        }, false);
    });
})(window, window.angular, jQuery);