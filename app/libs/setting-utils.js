(function(window, $, undefined) {
    "use strict";

    var Configs = window.Configs;
    var Utils = window.Utils;
    var SettingModel = window.SettingModel;

    var SettingUtils = function() {};

    // ----------------------------------- PUBLIC FUNCTION AND VARIABLES ---------------------------------------

    // all DEFAULT cache value
    SettingUtils.cache = {
        defaultLanguage: null,
        latestUsedWalletKey: null,
        noShowAgain: null,
        latestPrice: null,
        activeFiat: 'USD',
        feeSend: null,
        lastAccount: null
    };

    SettingUtils.dumpCache = function() {
        if (typeof SettingUtils.cache != "undefined") {
            console.log('settings cache data: ', SettingUtils.cache);
        }
    }

    SettingUtils.updateCache = function(callbackFunction) {
        // get settings from DB and cache it
        SettingUtils.getAllSettings(callbackFunction);
    }

    SettingUtils.checkDefaultSettings = function(callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        SettingUtils.getAllSettings(function(err, currentSettings) {
            if (currentSettings) {
                return callback(currentSettings);
            }
            var db = new SettingModel();
            db.reset().update(SettingUtils.cache, function(err, numAffected, affectedDocuments) {
                if (err) {
                    return callback('CANNOT_SET_DEFAULT_SETTING');
                }
                return callback(null);
            });
        });
    }

    /**
        @param:
        callbackFunction (function): function(err, objSettings). The objSettings will be the same as _fields of SettingModel.
    **/
    SettingUtils.getAllSettings = function(callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        try {
            var db = new SettingModel();
            db.reset().find(function(err, docs) {
                if (err) {
                    callback('CANNOT_GET_SETTING', null);
                } else {
                    if (docs.length == 0) {
                        // no seetings insert before
                        callback(null, null);
                    } else {
                        // Update cache
                        SettingUtils.cache = docs[0];
                        callback(null, docs[0]);
                    }
                }
            });
        } catch (ex) {
            console.log('SettingUtils.getAllSettings exception: ', ex);
            callback('UNKNOW_ERROR');
        }
    }

    /**
        @param:
        key: string, 
        callbackFunction (function): function(err, value).
    **/
    SettingUtils.getSetting = function(key, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        try {
            if (typeof key == 'string' && key.length > 0) {
                if (typeof SettingUtils.cache[key] != "undefined" && SettingUtils.cache[key] != null) {
                    callback(null, SettingUtils.cache[key]);
                } else {
                    SettingUtils.getAllSettings(function(err, objSettings) {
                        if (err) {
                            callback('GET_SETTING_ERROR', null);
                        } else {
                            if (objSettings != null && typeof objSettings[key] != "undefined") {
                                callback(null, objSettings[key]);
                            } else {
                                // Setting on this key is not set before
                                callback(null, null);
                            }
                        }
                    });
                }
            } else {
                callback('INVALID_PARAMETER');
            }
        } catch (ex) {
            console.log('SettingUtils.getSetting exception: ', ex);
            callback('UNKNOW_ERROR');
        }
    }

    /**
        @param:
        key: string, 
        value: anything that is different from undefined, 
        callbackFunction: function(err){}
    **/
    SettingUtils.updateSetting = function(key, value, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        try {
            if (typeof key == 'string' && key.length > 0 && typeof value != "undefined") {
                var db = new SettingModel(),
                    data = {};
                data[key] = value;
                db.reset().update(data, function(err, numAffected, affectedDocuments) {
                    if (err) {
                        callback('CANNOT_UPDATE_SETTING');
                    } else {
                        SettingUtils.cache[key] = value;
                        callback(null);
                    }
                });
            } else {
                callback('INVALID_PARAMETER');
            }
        } catch (ex) {
            console.log('SettingUtils.updateSetting exception: ', ex);
            callback('UNKNOW_ERROR', null);
        }
    }

    SettingUtils.setActiveAccount = function(account) {
        localStorage.setItem('activeAccount', account);
    }

    SettingUtils.getActiveAccount = function() {
        var acc = localStorage.getItem('activeAccount');
        return acc;
    }

    window.SettingUtils = SettingUtils;

})(window, window.$);