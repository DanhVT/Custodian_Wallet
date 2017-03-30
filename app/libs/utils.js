(function(window, $, undefined) {
    "use strict";

    var Configs = window.Configs;

    if (!Configs.debug) {
        // disable log on console in production mode
        console.log = console.warn = function() {}
    }

    var Utils = function() {};

    Utils.detectOS = function() {
        var OSName = "Unknown OS";
        if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
        if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
        if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
        return OSName;
    }

    Utils.isWinOS = function() {
        return (Utils.detectOS() == 'Windows');
    };

    Utils.getOsLanguage = function() {
        var lang = Configs.defaultLang;
        if (typeof navigator != "undefined" && typeof navigator.language != "undefined") {
            var arr = navigator.language.split('-');
            if (arr.length > 0) {
                for (var i = 0; i < Configs.langCodeList.length; i++) {
                    if (Configs.langCodeList[i] == arr[0]) {
                        lang = arr[0];
                        break;
                    }
                }
            }
        }
        return lang;
    }

    Utils.getDirSeparator = function() {
        return (Utils.isWinOS() ? '\\' : '/');
    };

    Utils.getObjectKeys = function(obj) {
        var arr = $.map(obj, function(value, index) {
            return index;
        });
        return arr;
    };

    Utils.getObjectValues = function(obj) {
        var arr = $.map(obj, function(value, index) {
            return value;
        });
        return arr;
    };

    Utils.arrayToObject = function(arr) {
        var obj = {};
        if (typeof arr != "undefined" && arr.constructor === Array && arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]] = arr[i];
            }
        }
        return obj;
    };

    Utils.removeLastForwardSlash = function(string) {
        if (typeof string == "string" && string.length > 0) {
            if (Utils.isWinOS()) {
                return string
                    .replace(/\\+/g, '/') // replace consecutive slashes with a single slash
                    .replace(/\\+$/, ''); // remove trailing slashes
            } else {
                return string
                    .replace(/\/+/g, '/') // replace consecutive slashes with a single slash
                    .replace(/\/+$/, ''); // remove trailing slashes
            }
        }
        return string;
    };

    Utils.convertNumber = function(num) {
        try {
            if (typeof num == "undefined") return 0;
            num = num.toString();
            var pattern = new RegExp(/e/i);
            if (!pattern.test(num)) {
                return (num * 1);
            }
            num = parseFloat(num).toFixed(20).toString();
            num = num.replace(/0+$/, '');
            return num;
        } catch (ex) {
            return 0;
        }
    }

    Utils.soundPlay = function(fileName) {
        try {
            var audio = new Audio('alta/sound/' + fileName);
            audio.currentTime = 0;
            audio.play();
        } catch (ex) {
            console.log('sound play exception: ', ex);
        }
    }

    Utils.newTxSoundNotification = function() {
        Utils.soundPlay('transaction.mp3');
    }

    Utils.balanceChangedSoundNotification = function() {
        Utils.soundPlay('money.wav');
    }

    /**
     * Create "GET" request
     * A error can be: "timeout", "error", "abort", and "parsererror"
     */
    Utils.getRequest = function(url, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: url,
            type: 'GET',
            timeout: 3 * 60 * 1000,
            statusCode: {
                429: function(data, error) {
                    callback('MANY_REQUESTS', data);
                }
            },
            success: function(data) {
                callback(null, data);
            },
            error: function(xhr, status, error) {
                if (xhr.readyState != 4 || (xhr.readyState == 4 && xhr.status == 0)) {
                    console.log('Utils.getRequest: CANNOT_CONNECT_TO_SERVER');
                    callback('CANNOT_CONNECT_TO_SERVER', null);
                } else {
                    if (error) {
                        if (xhr.responseText) {
                            callback('MANY_REQUESTS', null);
                        } else if (xhr.responseJSON) {
                            callback(xhr.responseJSON, null);
                        } else {
                            callback('UNKNOW_RESPONSE', null);
                        }
                    } else {
                        callback('UNKNOW_ERROR', null);
                    }
                }
            }
        });
    };

    /**
     * Create "POST" request
     */
    Utils.postRequest = function(url, data, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            url: url,
            type: 'POST',
            data: data,
            contentType: "application/x-www-form-urlencoded",
            timeout: 3 * 60 * 1000,
            statusCode: {
                429: function(data, error) {
                    callback('MANY_REQUESTS', data);
                }
            },
            success: function(data) {
                callback(null, data);
            },
            error: function(xhr, status, error) {
                if (xhr.readyState != 4 || (xhr.readyState == 4 && xhr.status == 0)) {
                    console.log('Utils.postRequest: CANNOT_CONNECT_TO_SERVER');
                    callback('CANNOT_CONNECT_TO_SERVER', null);
                } else {
                    if (error) {
                        if (xhr.responseText) {
                            callback('MANY_REQUESTS', null);
                        } else if (xhr.responseJSON) {
                            callback(xhr.responseJSON, null);
                        } else {
                            callback('UNKNOW_RESPONSE', null);
                        }
                    } else {
                        callback('UNKNOW_ERROR', null);
                    }
                }
            }
        });
    };


    Utils.dp = function() {
        return 'AltaWallet_info@cardano-labo.com';
    };

    Utils.getFeeSend = function(coinName, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        if (typeof Configs.feeSend[coinName] == 'undefined' || Configs.feeSend[coinName] == null) {
            callback(null);
        } else {
            var feeSend = Configs.feeSend[coinName]['medium'];
            SettingUtils.getSetting('feeSend', function(err, data) {
                if (!err && data != null) {
                    feeSend = Configs.feeSend[coinName][data];
                }
                callback(feeSend);
            });
        }
    };

    /* Utils.formatCurrency(0.000017,5) = 0.00002, Utils.formatCurrency(0.000017,4) = 0 */
    Utils.formatCurrency = function(value, max) {
        if (typeof parseFloat(value) == "NaN" || typeof parseInt(max) == "NaN")
            return 0;
        value = parseFloat(value);
        var negative = false;
        if (value < 0) {
            value = value * (-1);
            negative = true;
        }
        var numRound = Math.round(value * Math.pow(10, parseInt(max))) / Math.pow(10, parseInt(max));
        if (numRound == 0)
            return 0;
        var arrNum = numRound.toString().split('.');
        var result = arrNum[0].toString().replace(/./g, function(c, i, a) {
            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });
        return (negative ? '-' : '') + result + (arrNum[1] ? '.' + arrNum[1] : '');
    };

    Utils.checkInputValue = function(event, value) {
        var charCode = event.keyCode;
        var value = value ? value.toString() : '';
        // 48 - 57: 0-9 keys
        // 96 - 105: 0-9 keys
        // 190, 110: dot key
        if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || ((charCode == 110 || charCode == 190) && value.indexOf('.') == -1 && value != '')) {
            return true;
        }

        // 65: A key
        // 67: C key
        // 86: V key
        if (event.ctrlKey && (charCode == 65 || charCode == 67 || charCode == 86)) {
            return true;
        }

        // 9: tab key
        if (event.shiftKey && charCode == 9) {
            return true;
        }

        // 8: backspace key
        // 37: left arrow key
        // 39: right arrow key
        // 46: delete key
        if (charCode == 8 || charCode == 9 || charCode == 37 || charCode == 39 || charCode == 46) {
            return true;
        }

        return false;
    };

    Utils.checkEnglishKeyboard = function(str) {
        var patten = /[A-Za-z0-9+×÷=%/\\$@*!#:;&_()-\\'",.?[\]<>~{}|]/g;
        if (str == undefined || str == null) {
            return false;
        }
        return str.toString().replace(patten, '') == '';
    }

    Utils.removeEnglishKeyboard = function(str) {
        var patten = /[^A-Za-z0-9+×÷=%/\\$@*!#:;&_()-\\'",.?[\]<>~{}|]/g;
        if (str == undefined || str == null) {
            return '';
        }
        return str.toString().replace(patten, '');
    }


    window.Utils = Utils;

})(window, window.$);