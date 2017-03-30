(function(window, undefined) {
    "use strict";

    var isElectron = (typeof window.process != "undefined" && typeof window.process.versions != "undefined" && typeof window.process.versions.electron != "undefined");
    if (isElectron) {
        var electron = require("electron"),
            electronRemote = electron.remote,
            mainWindow = electronRemote.getCurrentWindow(),
            clipboard = electronRemote.clipboard,
            nativeImage = electronRemote.nativeImage,
            electronShell = electronRemote.shell;
    }


    var UtilsExt = function() {};

    // Close electron window
    UtilsExt.closeWindow = function() {
        if (isElectron) {
            mainWindow.close();
        }
    };

    // Minimize electron window
    UtilsExt.minimizeWindow = function() {
        if (isElectron) {
            mainWindow.minimize();
        }
    }

    /**
     * Copy image to clipboard
     */
    Utils.copyImageToClipboard = function(image) {
        if (isElectron) {
            clipboard.writeImage(nativeImage.createFromDataURL(image));
        }
    };

    // Open an url in default browser different from electron
    UtilsExt.openBrowser = function(url) {
        if (isElectron && typeof url == "string" && url.length > 0) {
            electronShell.openExternal(url);
        }
    };

    window.UtilsExt = UtilsExt;

})(window);