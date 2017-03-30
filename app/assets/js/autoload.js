var module = undefined; // Disable nodejs detect
const ipc = require('electron').ipcRenderer;
(function(window, undefined) {
    "use strict";

    var AppLoader = {};

    // --------------------------------------------------------------------------------------------------------

    AppLoader.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    AppLoader.loadCssHack = function(url, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
        var img = document.createElement('img');
        img.onerror = function() {
            callback();
        };
        img.src = url;
    };

    AppLoader.loadRemote = function(url, type, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        if (type === "css" && AppLoader.isSafari) {
            AppLoader.loadCssHack(url, callback);
            return;
        }
        var _element, _type, _attr, scr, s, element;
        switch (type) {
            case 'css':
                _element = "link";
                _type = "text/css";
                _attr = "href";
                break;
            case 'js':
                _element = "script";
                _type = "text/javascript";
                _attr = "src";
                break;
        }
        scr = document.getElementsByTagName(_element);
        element = document.createElement(_element);
        element.type = _type;
        if (type == "css") {
            element.rel = "stylesheet";
        }
        if (element.readyState) {
            element.onreadystatechange = function() {
                if (element.readyState == "loaded" || element.readyState == "complete") {
                    element.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            element.onload = function() {
                callback();
            };
        }
        element[_attr] = url;
        if (scr.length == 0) {
            var scr = document.getElementsByTagName('script');
        }
        s = scr[scr.length - 1];
        s.parentNode.insertBefore(element, s.nextSibling);
    };

    AppLoader.loadScript = function(url, callbackFunction) {
        AppLoader.loadRemote(url, "js", callbackFunction);
    };

    AppLoader.loadCss = function(url, callbackFunction) {
        AppLoader.loadRemote(url, "css", callbackFunction);
    };

    // --------------------------------------------------------------------------------------------------------

    AppLoader.loadApp = function() {

        var depsJs = 'configs/dependencies.js',
            appJs = 'configs/app.js',
            waitingInterval = 2 * 1000;

        AppLoader.loadScript(depsJs, function() {
            setTimeout(function() {
                if (typeof appDependencies != "object" || appDependencies == null) {
                    console.log('missing dependencies');
                    return;
                }

                var arr = [];

                if (typeof appDependencies.core != "undefined" && appDependencies.core.constructor === Array && appDependencies.core.length > 0) {
                    arr.push(appDependencies.core);
                }

                if (typeof appDependencies.libs != "undefined" && appDependencies.libs.constructor === Array && appDependencies.libs.length > 0) {
                    arr.push(appDependencies.libs);
                }

                if (typeof appDependencies.modules != "undefined" && appDependencies.modules.constructor === Array && appDependencies.modules.length > 0) {
                    arr.push(appDependencies.modules);
                }

                syncLoop(arr.length, function(loop) {
                    var depsIndex = loop.iteration(),
                        depsArr = arr[depsIndex],
                        cssArr = [],
                        jsArr = [];
                    for (var i = 0; i < depsArr.length; i++) {
                        var file = depsArr[i];
                        if (file.match(/.css$/)) {
                            cssArr.push(file);
                        } else if (file.match(/.js$/)) {
                            jsArr.push(file);
                        }
                    }
                    AppLoader.loadFileList(cssArr, 'css', function(filesLoaded) {
                        //console.log('css filesLoaded %s: ', depsIndex, filesLoaded);
                        AppLoader.loadFileList(jsArr, 'js', function(filesLoaded) {
                            //console.log('js filesLoaded %s: ', depsIndex, filesLoaded);
                            loop.next();
                        });
                    });
                }, function() {
                    // load routes.js
                    AppLoader.loadScript(appJs, function() {
                        console.log('app loaded');
                        // qaw: remove autoUpdater
                        // ipc.send('onAutoUpdaterTriggered', Configs.servers.autoUpdater);
                    });
                });

            }, waitingInterval);
        });

    };

    AppLoader.loadFileList = function(arr, type, callback) {
        var filesLoaded = [];
        syncLoop(arr.length, function(loop) {
            var i = loop.iteration(),
                url = arr[i];
            if (type == "css") {
                AppLoader.loadCss(url, function() {
                    filesLoaded.push(url);
                    loop.next();
                });
            } else {
                AppLoader.loadScript(url, function() {
                    filesLoaded.push(url);
                    loop.next();
                });
            }
        }, function() {
            if (callback && typeof callback === "function") {
                callback(filesLoaded);
            }
        });
    };

    AppLoader.detectOS = function() {
        var OSName = "Unknown OS";
        if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
        if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
        if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
        return OSName;
    }

    function syncLoop(iterations, process, exit) {
        var index = 0,
            done = false,
            shouldExit = false;
        var loop = {
            next: function() {
                if (done) {
                    if (shouldExit && exit) {
                        return exit(); /*Exit if we're done*/
                    }
                }
                /*If we're not finished*/
                if (index < iterations) {
                    index++; /*Increment our index*/
                    process(loop); /*Run our process, pass in the loop*/
                    /*Otherwise we're done*/
                } else {
                    done = true; /*Make sure we say we're done*/
                    if (exit) exit(); /*Call the callback on exit*/
                }
            },
            iteration: function() {
                return index - 1; /*Return the loop number we're on*/
            },
            break: function(end) {
                done = true; /*End the loop*/
                shouldExit = end; /*Passing end as true means we still call the exit callback*/
            }
        };
        loop.next();
        return loop;
    }

    AppLoader.loadApp();

    window.AppLoader = AppLoader;

})(window);