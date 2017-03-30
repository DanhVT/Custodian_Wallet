(function(window, angular, undefined) {
    "use strict";

    var UtilsExt = window.UtilsExt;
    var WalletUtils = window.WalletUtils;
    var Configs = window.Configs;
    var AngularUtils = window.AngularUtils;
    var Utils = window.Utils;
    var { ipcRenderer, remote } = require('electron');
    var MODULE_NAME = 'quanta.dashboard',
        ngModule = angular.module(MODULE_NAME);

    ngModule.controller('overviewController', ['$rootScope', '$scope', '$http', '$window', '$state', '$timeout',
        '$filter', '$mdDialog', 'clipboard', '$mdToast', 'sendCoinService',
        'dashboardService',
        'submitService', 'confirmService', overviewController
    ]);
    ngModule.controller('coinDetailController', ['$rootScope', '$scope', '$window', '$state', '$timeout', '$filter', '$mdDialog', 'clipboard', '$mdToast', 'sendCoinService', 'dashboardService', 'submitService', 'confirmService', overviewController]);

    function coinDetailController($rootScope, $scope, $window, $state, $timeout, $filter, $mdDialog, clipboard, $mdToast, sendCoinService, dashboardService) {
        var self = $scope;
    }

    function overviewController($rootScope, $scope, $http, $window, $state, $timeout, $filter, $mdDialog,
        clipboard, $mdToast, sendCoinService, dashboardService, submitService, confirmService) {
        var self = $scope;
        // Load active account
        self.activeAccount = {};

        self.contracts = $window.Contracts;

        this.$onInit = function() {
            hideLoadingAnimation();
        }
    }
})(window, window.angular);