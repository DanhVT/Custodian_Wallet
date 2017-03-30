"use strict";
if (require('electron-squirrel-startup')) return;
const electron = require("electron");

const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const { Menu } = require("electron");

const path = require('path');
let mainWindow;
//================ Config ======================= 
var dev = true;
var enableAutoUpdater = true;
//===============================================
const menuTemplate = [];

//========== Initialize ========================= 
function initialize() {
    var shouldQuit = makeSingleInstance()
    if (shouldQuit) return app.quit()
    var dataPath = app.getPath('userData');
    var appDataPath = app.getPath('appData');
    var separator = '/';

    if (process.platform.match(/^Win/i)) {
        separator = '\\';
    }
    // Create share object
    global.sharedObject = {};
    global.sharedObject.dataPath = dataPath;
    global.sharedObject.appPath = app.getAppPath();

    function createWindow() {
        var win = process.platform.indexOf('win');
        if (win == 0)
            win = 30;
        else if (win > 0)
            win = 20;
        else win = 0;

        var windowOptions = {
            width: (dev ? 1724 : 1024),
            height: 700 + win,
            resizable: true,
            frame: true,
            backgroundColor: 'rgba(0, 0, 0, 0)'
        };

        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.setMenu(null);

        // Open the DevTools.
        if (dev) {
            mainWindow.webContents.openDevTools();
        }

        mainWindow.loadURL("file://" + __dirname + "/index.html");


        // Emitted when the window is closed.
        mainWindow.on("closed", function() {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        });

        // Add menu for OSX
        createMenu();
    }
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    app.on("ready", function() {
        createWindow();
    });

    // Quit when all windows are closed.
    app.on("window-all-closed", function() {
        app.quit();
    });

    app.on("activate", function() {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    });
}

/**
 * Create system menu
 */
function createMenu() {
    if (process.platform === 'darwin') {
        const name = electron.app.getName();
        const version = electron.app.getVersion()
        menuTemplate.unshift({
            label: name,
            submenu: [{
                label: `Version ${version}`,
                enabled: false
            }, {
                label: 'Checking for Update',
                enabled: false,
                visible: false,
                key: 'checkingForUpdate'
            }, {
                label: 'Check for Update',
                visible: false,
                key: 'checkForUpdate',
                click: function() {
                    require('electron').autoUpdater.checkForUpdates()
                }
            }, {
                label: 'Restart and Install Update',
                enabled: true,
                visible: false,
                key: 'restartToUpdate',
                click: function() {
                    require('electron').autoUpdater.quitAndInstall()
                }
            }, {
                type: 'separator'
            }, {
                role: 'quit'
            }]
        })
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    }
}

function makeSingleInstance() {
    if (process.mas) return false

    return app.makeSingleInstance(function() {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}


//========== Handle Squirrel events =============
switch (process.argv[1]) {
    case '--squirrel-install':
        autoUpdater.createShortcut(function() { app.quit() })
        break
    case '--squirrel-uninstall':
        autoUpdater.removeShortcut(function() { app.quit() })
        break
    case '--squirrel-obsolete':
    case '--squirrel-updated':
        app.quit();
        break
    default:
        initialize();
}