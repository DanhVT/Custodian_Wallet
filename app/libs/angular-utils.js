(function(window, angular, undefined) {
    "use strict";

    var AngularUtils = function() {};

    AngularUtils.getInjector = function(element) {
        if (typeof element != "undefined" && angular.element(element).length > 0 && typeof angular.element(element).injector() != "undefined") {
            return angular.element(element).injector();
        }
        return angular.element(document).injector();
    }

    AngularUtils.getLocationService = function() {
        var $injector = AngularUtils.getInjector();
        return $injector.get('$location');
    }

    AngularUtils.getScope = function(element) {
        return angular.element(element).scope();
    }

    AngularUtils.applyRootScope = function() {
        var $rootScope = angular.element(document).scope();

        if ($rootScope && !$rootScope.$$phase) {
            $rootScope.$apply();
        }
    }

    AngularUtils.changeLanguage = function(lang) {
        moment.locale(lang.code);
        $('.LPC').each(function() {
            var scope = AngularUtils.getScope(this);
            scope.lang = lang;
            if (faq !== null)
                scope.faq = faq[lang.code];
            if (!scope.$$phase)
                scope.$apply();
        })
        AngularUtils.applyRootScope();
    }
    AngularUtils.Toast = function($mdToast, message, time) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(message)
            .position('bottom right')
            .hideDelay(time)
        );
    }

    AngularUtils.updateLang = function($timeout, $scope) {
        $timeout(function() {
            SettingUtils.getSetting('defaultLanguage', function(err, userLang) {
                if (!err && typeof userLang == "string" && userLang.length > 0) {
                    $scope.lang = allLang[userLang];
                }
            });
        });
    }

    /**
     * Broadcast event
     */
    AngularUtils.broadcast = function(eventName, data) {
        var $rootScope = angular.element(document).scope();
        $rootScope.$broadcast(eventName, data);
    }

    AngularUtils.checkmdDialog = function() {
        if (angular.element(document).find('md-dialog').length > 0)
            return true;
        return false;
    }

    window.AngularUtils = AngularUtils;

})(window, window.angular);