(function(window, undefined) {
    "use strict";
    var http = require('http');
    var https = require('https');
    var fs = require('fs');
    var globalObject = require('electron').remote.getGlobal('sharedObject');
    var Path = require('path');

    var FileCommon = function() {};

    /**
     * Download file
     */
    FileCommon.download = function(url, dest, cb) {
        if (FileCommon.isFile(dest)) {
            try {
                FileCommon.removeFile(dest);
            } catch (e) {
                return cb(e);
            }
        }
        var file = fs.createWriteStream(dest);
        var httpClient = http;
        if (url.match(/^https/i)) {
            httpClient = https;
        }
        var request = httpClient.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close();
            });

            file.on('close', function(err) {
                cb(err);
            });
        }).on('error', function(err) {
            // Delele unfinish file
            fs.unlink(dest);
            if (typeof cb == 'function') {
                return cb(err);
            }
        });
    };

    /**
     * Read file
     */
    FileCommon.readFile = function(filePath) {
        try {
            return fs.readFileSync(filePath);
        } catch (e) {
            console.error('READ_FILE_ERROR');
            console.error(e);
            return null;
        }
    }

    /**
     * Read file as json
     */
    FileCommon.readFileAsJson = function(filePath) {
        var data = FileCommon.readFile(filePath);
        if (data == null) {
            return null;
        }
        data = data.toString();
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('INVALID_JSON_DATA');
            console.error(e);
            return null;
        }
    }

    /**
     * Check file is existed
     */
    FileCommon.fileExists = function(filePath) {
        try {
            return fs.statSync(filePath).isFile();
        } catch (err) {
            return false;
        }
    }

    /**
     * Check file
     */
    FileCommon.isFile = function(filePath) {
        if (!fs.existsSync(filePath)) {
            return false;
        }
        return fs.statSync(filePath).isFile();
    }

    /**
     * Remove file
     */
    FileCommon.removeFile = function(path) {
        fs.unlinkSync(path);
    }

    /**
     * Extract zip file
     */
    FileCommon.unzip = function(filePath, destPath, cb) {
        fs.readFile(filePath, function(err, data) {
            if (err) throw err;
            var files = [];
            // Load data in zip file
            JSZip.loadAsync(data).then(function(zip) {
                async.series([
                    // Create dir
                    function(sCb) {
                        try {
                            FileCommon.createDir(Path.parse(destPath).name);
                            for (var fileName in zip.files) {
                                if (fileName.endsWith('/')) {
                                    var dirPath = FileCommon.joinPath(destPath, fileName);
                                    if (!FileCommon.isDir(dirPath)) {
                                        FileCommon.createDir(dirPath);
                                    }
                                } else {
                                    files.push(fileName);
                                }
                            }
                        } catch (ex) {
                            console.error(ex);
                            sCb(ex);
                        }
                        sCb();
                    },
                    // Write file
                    function(sCb) {
                        async.each(files, function(fileName, eCb) {
                            var fileZip = zip.file(fileName);
                            // Create dir
                            FileCommon.createDir(FileCommon.joinPath(destPath, fileName));
                            if (fileZip) {
                                if (fileName.endsWith('png')) {
                                    fileZip.async('base64').then(
                                        function success(content) {
                                            var filePath = FileCommon.joinPath(destPath, fileName);
                                            fs.writeFile(filePath, content, 'base64', function(err) {
                                                eCb(err);
                                            });
                                        },
                                        function error(err) {
                                            console.error(err);
                                            eCb(err);
                                        });
                                } else {
                                    fileZip.async('array').then(
                                        function success(content) {
                                            var filePath = FileCommon.joinPath(destPath, fileName);
                                            fs.writeFile(filePath, new Buffer(content), function(err) {
                                                eCb(err);
                                            });
                                        },
                                        function error(err) {
                                            console.error(err);
                                            eCb(err);
                                        });
                                }

                            } else {
                                eCb();
                            }
                        }, function(err) {
                            sCb(err);
                        });
                    }
                ], function(err) {
                    cb(err);
                });
            });
        });
    }

    /**
     * Get data dir path
     */
    FileCommon.getDataDirPath = function() {
        return globalObject.dataPath;
    }

    /**
     * Get data dir path
     */
    FileCommon.getPluginDirPath = function() {
        return Path.join(globalObject.dataPath, 'plugins');
    }

    /**
     * Get app dir path
     */
    FileCommon.getAppPath = function() {
        return globalObject.appPath;
    }

    /**
     * Join path
     */
    FileCommon.joinPath = function() {
        if (!arguments || arguments.length == 0) {
            return '';
        }

        var path = arguments[0];

        for (var i = 1; i < arguments.length; i++) {
            path = Path.join(path, arguments[i]);
        }
        return path;
    }

    /**
     * Delete directory
     */
    FileCommon.removeDir = function(path, cb) {
        RmDir(path, function(err) {
            return cb(err);
        });
    }

    /**
     * Copy dir
     */
    FileCommon.copyDir = function(src, dest, cb) {
        NCP(src, dest, cb);
    }

    /**
     * Create directory and subdirectory
     */
    FileCommon.createDir = function(path) {
        // Get dir path only
        path = Path.parse(path).dir;

        var dirList = path.split(Path.sep);
        var curPath = dirList[0];
        if (path[0] == '/') {
            curPath = '/' + curPath;
        }

        for (var i = 1; i < dirList.length; i++) {
            curPath = FileCommon.joinPath(curPath, dirList[i]);
            if (!FileCommon.isDir(curPath)) {
                fs.mkdirSync(curPath);

            }
        }
    }

    /**
     * Is directory
     */
    FileCommon.isDir = function(path) {
        if (fs.existsSync(path)) {
            return fs.statSync(path).isDirectory();
        }
        return false;
    }

    /**
     * Get file name from URL
     */
    FileCommon.extractFileNameFromUrl = function(url, isLocal) {
        if (isLocal) {
            return Path.basename(url);
        }
        var parsed = Url.parse(url);
        return Path.basename(parsed.pathname);
    }

    /**
     * Get information from path
     */
    FileCommon.parse = function(path) {
        return Path.parse(path);
    }

    FileCommon.readdir = function(path) {
        return fs.readdirSync(path);
    }

    window.FileCommon = FileCommon;
})(window);