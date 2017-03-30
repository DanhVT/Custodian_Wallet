(function(window, $, angular, undefined) {
    'use strict';

    var TEST_MODE = true;

    var MODULE_NAME = 'QuantaWalletApplication';

    var depsModules = ['ui.router', 'ui.bootstrap', 'ngMaterial', 'ngSanitize', 'pascalprecht.translate', 'angular-clipboard', 'angularMoment'];

    var altaModules = ['quanta.dashboard', 'quanta.languages', 'quanta.register', 'quanta.app.general'];

    var app = angular.module(MODULE_NAME, depsModules.concat(altaModules));
    app.controller('appController', ['$rootScope', '$scope', appController]);


    function appController($rootScope, $scope) {


    }

    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$injector', angularAppConfig]);

    app.run(['$rootScope', '$templateCache', angularAppRun]);

    function angularAppConfig($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provider, $injector) {

        /*$locationProvider.html5Mode(true);*/

        $urlRouterProvider.otherwise('dashboard');

        $stateProvider.state('dashboard', {
                url: '/dashboard',
                views: {
                    defaultView: {
                        templateUrl: "modules/dashboard/templates/index.html"
                    }
                }
            })
            .state('dashboard.balance', {
                url: '/dashboard.balance',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/balance.html"
                    }
                }
            }).state('dashboard.wallet', {
                url: '/dashboard.wallet',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/wallet.html"
                    }
                }
            }).state('dashboard.backupsuccess', {
                url: '/dashboard.backupsuccess',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/backup/backupSuccess.html"
                    }
                }
            }).state('dashboard.transaction', {
                url: '/dashboard.transaction',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/transaction.html"
                    }
                }
            }).state('dashboard.newfeed', {
                url: '/dashboard.newfeed',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/newfeed/index.html"
                    }
                }
            }).state('dashboard.help', {
                url: '/dashboard.help',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/help/feedback.html"
                    }
                }
            }).state('dashboard.exchange', {
                url: '/dashboard.exchange',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/exchange.html"
                    }
                }
            }).state('register', {
                url: '/register',
                views: {
                    defaultView: {
                        templateUrl: "modules/register/templates/register.template.html"
                    }
                }
            }).state('register.newPassphrase', {
                url: '/register.newPassphrase',
                views: {
                    registerView: {
                        templateUrl: "modules/register/templates/new-passphrase.template.html"
                    }
                }
            }).state('register.inputPassphrase', {
                url: '/register.inputPassphrase',
                views: {
                    registerView: {
                        templateUrl: "modules/register/templates/input-passphrase.template.html"
                    }
                },
                params: {
                    createNew: false
                }
            }).state('register.inputNameWallet', {
                url: '/register.inputNameWallet',
                views: {
                    registerView: {
                        templateUrl: "modules/register/templates/input-name.template.html"
                    }
                }
            }).state('register.inputPassword', {
                url: '/register.inputPassword',
                views: {
                    registerView: {
                        templateUrl: "modules/register/templates/input-password.template.html"
                    }
                }
            }).state('languages', {
                url: '/languages',
                views: {
                    defaultView: {
                        templateUrl: "modules/languages/templates/index.html"
                    }
                }
            }).state('languages.select', {
                url: '/languages.select',
                views: {
                    languageView: {
                        templateUrl: "modules/languages/templates/language-page.html"
                    }
                }
            }).state('languages.termpage', {
                url: '/languages.termpage',
                views: {
                    languageView: {
                        templateUrl: "modules/languages/templates/term.html"
                    }
                }
            }).state('dashboard.embedded-plugin', {
                url: '/dashboard.embedded-plugin',
                views: {
                    dashboardView: {
                        templateUrl: "modules/dashboard/templates/embedded-plugin/embedded-plugin.html"
                    }
                }
            }).state('dashboard.embedded-plugin.qnt', {
                url: '/dashboard.embedded-plugin.qnt',
                views: {
                    pluginView: {
                        templateUrl: "modules/qnt-plugin/templates/qnt.html"
                    }
                }
            });

    }

    function angularAppRun($rootScope, $templateCache) {
        if (TEST_MODE) {
            $rootScope.$on('$viewContentLoaded', function() {
                $templateCache.removeAll();
            });
        }
    }

    function bootstrap() {
        // start angular app
        angular.bootstrap(document, [MODULE_NAME]);
        console.log('bootstrap started');
    }

    bootstrap();

})(window, window.$, window.angular);