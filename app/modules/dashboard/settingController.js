(function(window, angular, undefined) {
    "use strict";
    var PasswordMeter = window.PasswordMeter;
    var WalletUtils = window.WalletUtils;
    var WalletModel = window.WalletModel;
    var AngularUtils = window.AngularUtils;
    var MODULE_NAME = 'quanta.dashboard',
        ngModule = angular.module(MODULE_NAME);
    ngModule.directive('settingMenu', function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/dashboard/templates/setting/menu.html',
            link: function($scope, element, attr) {}
        };
    });
    ngModule.controller('settingController', ['$rootScope', '$scope', '$window', '$state', '$timeout', '$sanitize', '$mdDialog', '$mdToast', settingController]);

    function settingController($rootScope, $scope, $window, $state, $timeout, $sanitize, $mdDialog, $mdToast) {

        function updateAngularModel() {
            $timeout(function() {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }

        $scope.lang = $rootScope.lang;
        $timeout(function() {
            SettingUtils.getSetting('defaultLanguage', function(err, userLang) {
                if (!err && typeof userLang == "string" && userLang.length > 0) {
                    $rootScope.lang = $scope.lang = allLang[userLang];
                    updateAngularModel();
                }
            });
        });

        /***
         *  Press enter key as update.
         */
        $scope.checkEnterKey = function(event, action) {
            if (event.keyCode == 13) {
                if (action == 'CHANGE_WALLET_NAME' && !$scope.changeWalletName.isDisabledUpdateButton) {
                    $scope.onConfirmChangeWalletName(event);
                }

                if (action == 'CHANGE_PASSWORD' && !$scope.changePassword.isDisabledUpdateButton) {
                    $scope.onConfirmChangePassword(event);
                }

                if (action == 'SHOW_PASSPHRASE' && !$scope.showPassphrase.isDisabledDisplayButton) {
                    $scope.onConfirmShowPassPhrase(event);
                }
            }
        }
        $scope.onKeyDownCurrentPassword = function(e) {
            console.log('onKeyDown', '|' + $scope.changePassword.currentPassword + '|', !Utils.checkEnglishKeyboard($scope.changePassword.currentPassword));
            if ($scope.changePassword.currentPassword == '' || $scope.changePassword.currentPassword == null ||
                !Utils.checkEnglishKeyboard($('#ipcurrentPassword').val())) {
                $scope.changePassword.currentPassword = Utils.removeEnglishKeyboard($('#ipcurrentPassword').val());
                $('#ipcurrentPassword').val($scope.changePassword.currentPassword);
            }
        }
        $scope.onKeyDownNewPassword = function(e) {
            console.log('onKeyDown', $scope.changePassword.newPassword, $('#ipnewPassword').val());
            if ($scope.changePassword.newPassword == '' || $scope.changePassword.newPassword == null ||
                !Utils.checkEnglishKeyboard($('#ipnewPassword').val())) {
                $scope.changePassword.newPassword = Utils.removeEnglishKeyboard($('#ipnewPassword').val());
                $('#ipnewPassword').val($scope.changePassword.newPassword);
            }
        }

        //------------------------------------------------------ CHANGE PASSWORD ----------------------------------------------

        $scope.changePassword = {
            error: '',
            rate: '',
            ratebar: '',
            isDisabledUpdateButton: true,
            newPassword: '',
            currentPassword: '',
            passwordDisplayType: ['password', 'text'],
            passwordButtonText: ['show', 'hide'],
            isShowPassword: 0,
            positiveButtonClass: 'disabled-button'
        };
        $scope.onChangePassword = function($event) {
            $mdDialog.show({
                ariaLabel: 'settingChangePassword',
                controller: settingController,
                templateUrl: 'modules/dashboard/templates/setting/change-password-dialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: false
            }).then(function() {}, function() {});
        }

        /**
         * Click button cancel change password event
         */
        $scope.onCancelChangePassword = function($event) {
            console.log('Change password cancel');
            console.log($scope.lang.setting.dialog.changePassword.lblCurrentPassword);
            $mdDialog.cancel('cancel');
        }

        /**
         * Click button update password event
         */
        $scope.onConfirmChangePassword = function($event) {
            console.log('Change password confirm');
            $window.showLoadingAnimation();
            WalletUtils.validatePassword($scope.changePassword.currentPassword, function(err, passphrase) {
                if (err) {
                    $scope.changePassword.error = $scope.lang.setting.dialog.changePassword.errors.wrongPassword;
                    updateAngularModel();
                    $window.hideLoadingAnimation();
                    console.log('currentPassword wrongPassword')
                } else {
                    $scope.changePassword.error = '';
                    var currentPassword = $scope.changePassword.currentPassword;
                    var newPassword = $scope.changePassword.newPassword;
                    WalletUtils.cache.currentWallet.objAltaWallet.changePassword(currentPassword, newPassword, newPassword, function(err, wallet) {
                        if (err) {
                            $scope.changePassword.error = $scope.lang.setting.dialog.changePassword.errors.wrongPassword;
                            updateAngularModel();
                            $window.hideLoadingAnimation();
                        } else {
                            var walletKey = WalletUtils.cache.currentWallet.key;
                            // Update wallet in database
                            var db = new WalletModel();
                            db.reset().where({
                                key: walletKey
                            }).update({
                                data: wallet.serialize()
                            }, function(err, numAffected) {
                                if (err || typeof numAffected == 'undefined') {
                                    $scope.changePassword.error = $scope.lang.setting.dialog.changePassword.errors.unknow;
                                } else {
                                    // Update cache
                                    WalletUtils.cache.currentWallet.objAltaWallet = wallet;
                                }
                                updateAngularModel();
                                $window.hideLoadingAnimation();
                                $mdDialog.hide('hide');
                                // TODO: show toast
                                AngularUtils.Toast($mdToast, $scope.lang.setting.dialog.changePassword.messages.changePasswordOk, 1000);
                            });
                        }
                    });
                }
            });
        }

        /**
         * Input new password event
         */
        $scope.onInputNewPassword = function($event) {
            if ($scope.changePassword.newPassword == null) {
                $scope.changePassword.ratebar = 'weak';
                $scope.changePassword.isDisabledUpdateButton = true;
                return false;
            }
            var pm = new PasswordMeter($scope.changePassword.newPassword, $window.Configs.password);
            $scope.changePassword.isDisabledUpdateButton = !pm.isValid();
            if ($scope.changePassword.currentPassword == $scope.changePassword.newPassword || $scope.changePassword.newPassword == '') {
                $scope.changePassword.isDisabledUpdateButton = true;
                return;
            }
            var rate = pm.getRate();
            switch (rate) {
                case 'very_weak':
                    rate = $scope.lang.label.weak;
                    $scope.changePassword.ratebar = 'weak';
                    break;
                case 'weak':
                    rate = $scope.lang.label.weak;
                    $scope.changePassword.ratebar = 'weak';
                    break;;
                case 'medium':
                    rate = $scope.lang.label.fair;
                    $scope.changePassword.ratebar = 'medium';
                    break;
                case 'strong':
                    rate = $scope.lang.label.strong;
                    $scope.changePassword.ratebar = 'strong';
                    break;
                default:
                    rate = $scope.lang.label.weak;
                    $scope.changePassword.ratebar = 'weak';
                    break;
            }
            $scope.changePassword.rate = rate;
            $scope.changePassword.positiveButtonClass = ($scope.changePassword.isDisabledUpdateButton ? 'disabled-button' : 'positive-button');
        }

        /**
         * onShowPassword
         */
        $scope.onShowPassword = function($event) {
            console.log('onShowPassword')
            $scope.changePassword.isShowPassword = $scope.changePassword.isShowPassword ^ 1;
        }

        //----------------------------------------------------- DISPLAY PASSPHRASE -----------------------------------------------

        $scope.showPassphrase = {
            password: '',
            isShowPassword: 0,
            passwordDisplayType: ['password', 'text'],
            passwordButtonText: ['show', 'hide'],
            isDisabledDisplayButton: true,
            positiveButtonClass: 'disabled-button',
            errorMessage: ''
        };
        $scope.onShowPassPhrase = function($event) {
            $mdDialog.show({
                ariaLabel: 'settingShowPassPhrase',
                controller: settingController,
                templateUrl: 'modules/dashboard/templates/setting/show-passphrase-dialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: false
            }).then(function(passphrase) {
                $scope.onShowPassPhraseContent($event, passphrase);
            }, function() {
                console.log('here');
            });
        }
        $scope.onCancelShowPassPhrase = function($event) {
            $mdDialog.cancel('cancel');
        }
        $scope.onConfirmShowPassPhrase = function($event) {
            WalletUtils.validatePassword($scope.showPassphrase.password, function(err, passphrase) {
                if (err) {
                    $scope.showPassphrase.errorMessage = $scope.lang.setting.dialog.displayPhassPhrase.passwordIncorrect;
                } else {
                    $scope.showPassphrase.errorMessage = '';
                    $mdDialog.hide(passphrase);
                }
                updateAngularModel();
            });
        }
        $scope.onPassPhrasePaswordChange = function($event) {
            var password = $scope.showPassphrase.password;
            if (typeof password == "undefined" || password.length == 0) {
                $scope.showPassphrase.isDisabledDisplayButton = true;
                $scope.showPassphrase.positiveButtonClass = 'disabled-button';
            } else {
                $scope.showPassphrase.isDisabledDisplayButton = false;
                $scope.showPassphrase.positiveButtonClass = 'positive-button';
            }
        }
        $scope.onPassphraseShowPassword = function($event) {
            $scope.showPassphrase.isShowPassword = $scope.showPassphrase.isShowPassword ^ 1;
        }
        $scope.onShowPassPhraseContent = function($event, passphrase) {
            $scope.passphrase = passphrase;
            $mdDialog.show({
                ariaLabel: 'settingShowPassPhraseContent',
                controller: settingController,
                templateUrl: 'modules/dashboard/templates/setting/passphrase-content-dialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: false,
                scope: $scope,
                preserveScope: true
            }).then(function() {}, function() {});
        }
        $scope.onCloseShowPassPhrase = function($event) {
            $mdDialog.cancel('close');
        }

        //------------------------------------------------------ CREATE WALLET ----------------------------------------------

        $scope.onCreateWallet = function($event) {
            $mdDialog.show({
                ariaLabel: 'settingCreateWallet',
                controller: settingController,
                templateUrl: 'modules/dashboard/templates/setting/create-wallet-dialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: false
            }).then(function() {}, function() {});
        }
        $scope.onCancelCreateWallet = function($event) {
            $mdDialog.cancel('cancel');
        }
        $scope.onConfirmCreateWallet = function($event) {
            $mdDialog.hide('hide');
            $state.go(Configs.pages.createWalletPage);
        }

        //------------------------------------------------------ CHANGE WALLET NAME ----------------------------------------------

        $scope.changeWalletName = {
            currentWalletName: '',
            walletName: '',
            isDisabledUpdateButton: true,
            positiveButtonClass: 'disabled-button',
            errorMessage: ''
        };
        $scope.onInitChangeWalletNameDialog = function() {
            $scope.changeWalletName.currentWalletName = WalletUtils.cache.currentWallet.name;
            $scope.changeWalletName.walletName = WalletUtils.cache.currentWallet.name;
        }
        $scope.onChangeWalletName = function($event) {
            $mdDialog.show({
                ariaLabel: 'settingChangeWalletName',
                controller: settingController,
                templateUrl: 'modules/dashboard/templates/setting/change-wallet-name-dialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: false
            }).then(function() {}, function() {});
        }
        $scope.onCancelChangeWalletName = function($event) {
            $mdDialog.cancel('cancel');
        }
        $scope.onConfirmChangeWalletName = function($event) {
            console.log('confirm change wallet name');
            // Check wallet name
            WalletUtils.checkWalletName($scope.changeWalletName.walletName, function(valid) {
                if (valid == 1) {
                    $scope.changeWalletName.errorMessage = '';
                    // Ready to save into DB
                    $window.showLoadingAnimation();
                    var db = new WalletModel();
                    db.reset().where({ key: WalletUtils.cache.currentWallet.key }).update({ name: $scope.changeWalletName.walletName }, function(err) {
                        if (err) {
                            $scope.changeWalletName.errorMessage = $scope.lang.setting.dialog.changeWalletName.messages.errors.nameNotUpdated;
                        } else {
                            // Update cache
                            WalletUtils.cache.currentWallet.name = $scope.changeWalletName.walletName;
                            for (var i = 0; i < WalletUtils.cache.listWalletModel.length; i++) {
                                if (WalletUtils.cache.listWalletModel[i].key == WalletUtils.cache.currentWallet.key) {
                                    WalletUtils.cache.listWalletModel[i].name = $scope.changeWalletName.walletName;
                                    break;
                                }
                            }
                            // Hide dialog
                            $scope.changeWalletName.errorMessage = $scope.lang.setting.dialog.changeWalletName.messages.success.nameUpdated;
                            $mdDialog.hide('hide');
                        }
                        updateAngularModel();
                        $window.hideLoadingAnimation(function() {
                            AngularUtils.Toast($mdToast, $scope.lang.setting.dialog.changeWalletName.messages.success.nameUpdated, 1000);
                        });
                    });
                } else {
                    if (valid == 0) {
                        $scope.changeWalletName.errorMessage = $scope.lang.register.createNewWallet.setWalletName.errors.walletNameInvalid;
                    } else {
                        $scope.changeWalletName.errorMessage = $scope.lang.register.createNewWallet.setWalletName.errors.walletNameExisted;
                    }
                    updateAngularModel();
                }
            });
        }
        $scope.onWalletNameChanged = function($event) {
            if (typeof $scope.changeWalletName.walletName == "undefined" || $scope.changeWalletName.walletName == "undefined" || $scope.changeWalletName.walletName.length == 0 || $scope.changeWalletName.walletName == $scope.changeWalletName.currentWalletName) {
                $scope.changeWalletName.isDisabledUpdateButton = true;
                $scope.changeWalletName.positiveButtonClass = 'disabled-button';
            } else {
                $scope.changeWalletName.isDisabledUpdateButton = false;
                $scope.changeWalletName.positiveButtonClass = 'positive-button';
            }
        }

        //------------------------------------------------------ CHANGE LANGUAGE ----------------------------------------------

        $scope.onChangeLanguage = function function_name($event) {
            $mdDialog.show({
                ariaLabel: 'Change language',
                templateUrl: 'modules/languages/templates/change-language-dialog.html',
                controller: languagePackagesController,
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: false
            }).then(function() {
                $state.go($state.current.name);
            }, function() {

            });
        }

        function languagePackagesController($rootScope, $scope, $window, $state, $mdDialog) {
            var self = $scope,
                osLang = Utils.getOsLanguage();
            self.langs = [];
            $rootScope.lang = allLang[osLang];
            $scope.lang = $rootScope.lang;
            self.fiats = Configs.fiats;
            self.mdfiat = 'USD';
            $scope.code = 'en';
            $timeout(function() {
                SettingUtils.getSetting('defaultLanguage', function(err, userLang) {
                    if (!err && typeof userLang == "string" && userLang.length > 0) {
                        $scope.code = userLang;
                        $scope.lang = $rootScope.lang = allLang[userLang];
                        updateAngularModel();
                    }
                });
                SettingUtils.getSetting('activeFiat', function(err, data) {
                    console.log('activeFiat', data);
                    if (!err && data != null) {
                        self.mdfiat = data;
                    }
                });
            });
            for (var i = 0; i < Configs.langCodeList.length; i++) {
                var code = Configs.langCodeList[i];
                if (typeof allLang[osLang]['selectLanguages'] != "undefined" && typeof allLang[osLang]['selectLanguages'][code] != "undefined") {
                    self.langs.push({
                        name: eval('$scope.lang.selectLanguages.' + code),
                        code: code
                    });
                }
            }

            // change language-packages
            self.onChangeLanguage = function(lang) {
                showLoadingAnimation()
                $rootScope.lang = $scope.lang = allLang[lang];
                AngularUtils.changeLanguage($rootScope.lang);
                SettingUtils.updateSetting('defaultLanguage', lang, function(err) {
                    self.onChangeFiat();
                });
            };

            self.onChangeFiat = function() {
                SettingUtils.updateSetting('activeFiat', self.mdfiat, function(data) {
                    if (!data) {
                        $mdDialog.hide();
                        $state.reload();
                        $timeout(function() {
                            hideLoadingAnimation();
                        }, 1000);
                    }
                });
            }
            self.onUpdate = function() {
                self.onChangeLanguage($scope.code);
            }
            self.onCancel = function(lang) {
                $mdDialog.cancel();
            }
        };


        //------------------------------------------------------ CHANGE FIAT ----------------------------------------------

        $scope.onChangeFiat = function function_name() {
            $mdDialog.show({
                ariaLabel: 'Change fiat',
                templateUrl: 'modules/dashboard/templates/setting/setting-fiat-dialog.html',
                controller: fiatController,
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: false
            }).then(function() {}, function() {

            });
        }

        function fiatController($rootScope, $scope, $window, $state, $mdDialog) {
            var self = $scope;
            self.fiats = Configs.fiats;
            self.mdfiat = 'USD';

            function updateAngularModel() {
                $timeout(function() {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.lang = $rootScope.lang;
            $timeout(function() {
                SettingUtils.getSetting('defaultLanguage', function(err, userLang) {
                    if (!err && typeof userLang == "string" && userLang.length > 0) {
                        $rootScope.lang = $scope.lang = allLang[userLang];
                        updateAngularModel();
                    }
                });
                SettingUtils.getSetting('activeFiat', function(err, data) {
                    console.log('activeFiat', data);
                    if (!err && data != null) {
                        self.mdfiat = data;
                    }
                });
            });

            self.onUpdate = function() {
                showLoadingAnimation();
                SettingUtils.updateSetting('activeFiat', self.mdfiat, function(data) {
                    if (!data) {
                        $mdDialog.hide();
                        $state.reload();
                    }
                    hideLoadingAnimation();
                });
            }

            self.onCancel = function(lang) {
                $mdDialog.cancel();
            }
        };

        //------------------------------------------------------ CHANGE Fee Send ----------------------------------------------

        $scope.onChangeFeeSend = function function_name() {
            $mdDialog.show({
                ariaLabel: 'Change fiat',
                templateUrl: 'modules/dashboard/templates/setting/setting-change-send-fee-dialog.html',
                controller: changeFeeSendController,
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: false
            }).then(function() {}, function() {

            });
        }

        function changeFeeSendController($rootScope, $scope, $window, $state, $mdDialog) {
            var self = $scope;
            self.feeSend = Configs.feeSend;
            self.feeSendSetting = [];
            self.mdsetting = 'medium';

            function updateAngularModel() {
                $timeout(function() {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }

            $scope.lang = $rootScope.lang;
            $timeout(function() {
                SettingUtils.getSetting('defaultLanguage', function(err, userLang) {
                    if (!err && typeof userLang == "string" && userLang.length > 0) {
                        $rootScope.lang = $scope.lang = allLang[userLang];
                        angular.forEach(Configs.feeSendSetting, function(value, key) {
                            if ($scope.lang.setting.dialog.feeSend.setting[key] != null)
                                self.feeSendSetting.push([key, $scope.lang.setting.dialog.feeSend.setting[key]]);
                        });
                        updateAngularModel();
                    }
                });
                SettingUtils.getSetting('feeSend', function(err, data) {
                    console.log('feeSend', data);
                    if (!err && data != null) {
                        self.mdsetting = data;
                    }
                });
            });

            self.onUpdate = function() {
                SettingUtils.updateSetting('feeSend', self.mdsetting, function(data) {
                    if (!data) {
                        $mdDialog.hide();
                        $state.reload();
                    }
                });
            }

            self.onCancel = function(lang) {
                $mdDialog.cancel();
            }
        };
    }
})(window, window.angular);