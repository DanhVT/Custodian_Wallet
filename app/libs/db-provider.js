/** 
    Dependencies: Nedb, syncLoop
**/

(function(window, undefined) {
    "use strict";

    var Configs = window.Configs,
        Utils = window.Utils;

    function _DbProvider(options) {
        if (!(this instanceof _DbProvider)) {
            return new _DbProvider(options);
        }

        var self = this;

        self._systemError = {
            _missingDatastore: 'Missing data store.'
        }

        self._orderByMap = {
            desc: -1,
            asc: 1
        };

        self._where = {};

        self._orderBy = {};

        self._limit = null;

        self._offset = 0;

        self._options = {
            datastore: null,
            uniqueKeys: []
        };

        if (typeof options == "object") {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    self._options[key] = options[key];
                }
            }
        }

        if (!self._options.datastore) {
            throw new Error(self._systemError._missingDatastore);
        }

        self._options.datastore += Configs.testnetString;

        self._db = new Nedb({
            filename: self._options.datastore,
            autoload: true
        });

        return self;
    }

    _DbProvider.prototype = {

        getDatastore: function() {
            var self = this;
            return self._db;
        },

        reset: function() {
            var self = this;
            self._where = {};
            self._orderBy = {};
            self._limit = null;
            self._offset = 0;
            return self;
        },

        where: function(objWhere) {
            var self = this;
            if (typeof objWhere == "object") {
                self._where = objWhere;
            }
            return self;
        },

        orderBy: function(objOrderBy) {
            var self = this;
            if (typeof objOrderBy == "object") {
                self._orderBy = objOrderBy;
            }
            return self;
        },

        limit: function(uIntLimit, uIntOffset) {
            var self = this;
            try {
                if (typeof uIntLimit == "number" && parseInt(uIntLimit, 10) > 0) {
                    self._limit = uIntLimit;
                }
                if (typeof uIntOffset == "number" && parseInt(uIntOffset, 10) >= 0) {
                    self._offset = uIntOffset;
                }
            } catch (ex) {
                console.log('limit exception: ', ex);
            }
            return self;
        },

        /** @param:
            callbackFunction: function(err, count)

            @usage:
            var db = new DbProvider({datastore: 'anyname'});
            db.reset().where({...}).limit(10, 0).orderBy({...}).findCount(callback);
        **/
        findCount: function(callbackFunction) {
            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
            try {

                self.find(function(err, docs) {
                    var cnt = (typeof docs != "undefined" && docs.constructor === Array ? docs.length : 0);
                    callback(err, cnt);
                });

            } catch (ex) {
                console.log('DbProvider - findCount exception: ', ex);
                callback('UNKNOW_ERROR', 0);
            }
        },

        /** @param:
            callbackFunction: function(err, docs)

            @usage:
            var db = new DbProvider({datastore: 'anyname'});
            db.reset().where({...}).limit(10, 0).orderBy({...}).find(callback);
        **/
        find: function(callbackFunction) {
            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
            try {

                var applySort = false,
                    orderBy = {};
                for (var key in self._orderBy) {
                    if (self._orderBy.hasOwnProperty(key)) {
                        var optKey = self._orderBy[key] + '';
                        if (typeof self._orderByMap[optKey.toLowerCase()] != "undefined") {
                            orderBy[key] = self._orderByMap[optKey.toLowerCase()];
                            applySort = true;
                        }
                    }
                }

                var dbCursor = self._db.find(self._where);
                if (applySort) {
                    dbCursor.sort(orderBy);
                }
                if (self._offset >= 0) {
                    dbCursor.skip(self._offset);
                }
                if (self._limit != null) {
                    dbCursor.limit(self._limit);
                }
                dbCursor.exec(function(err, docs) {
                    callback(err, docs);
                });

            } catch (ex) {
                console.log('DbProvider - getData exception: ', ex);
                callback('UNKNOW_ERROR', null);
            }
        },

        /** @param:
            arrKeyFields: an array contains fields name
            callbackFunction: function(err, arrDocs, objDocs)
                - arrDocs is an array, each element will be an object coresponding to a record.
                - objDocs is an object, 
                        * The KEY will be concat value of each field that is specified in arrKeyFields
                        * The VALUE will be an object coresponding to a record.

            @usage:
            var db = new DbProvider({datastore: 'anyname'});
            db.reset().where({...}).limit(10, 0).orderBy({...}).findDataPair([fieldA, fieldB,...], callback);
        **/
        findDataPair: function(arrFields, callbackFunction, keySeparator) {
            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
            try {
                if (typeof arrFields == "undefined" || arrFields.constructor !== Array || arrFields.length == 0) {
                    callback('INVALID_FIELDS_ARRAY', [], null);
                    return;
                }
                if (typeof keySeparator != "string" || keySeparator.length == 0) {
                    keySeparator = '~:~'; // default key separator
                }
                self.find(function(err, docs) {
                    if (err) {
                        callback(err, [], null);
                        return;
                    }
                    if (typeof docs == "undefined" || docs.constructor !== Array || docs.length == 0) {
                        callback('DATA_EMPTY', [], null);
                        return;
                    }
                    var arrDocs = [],
                        objDocs = {};
                    for (var i = 0; i < docs.length; i++) {
                        var keyArr = [];
                        for (var j = 0; j < arrFields.length; j++) {
                            keyArr.push(typeof docs[i][arrFields[j]] != "undefined" ? docs[i][arrFields[j]] : '???');
                        }
                        if (typeof objDocs[keyArr.join(keySeparator)] == "undefined") {
                            arrDocs.push(docs[i]);
                            objDocs[keyArr.join(keySeparator)] = docs[i];
                        }
                    }
                    callback(null, arrDocs, objDocs);
                });
            } catch (ex) {
                console.log('DbProvider - findDataPair exception: ', ex);
                callback('UNKNOW_ERROR', [], null);
            }
        },

        /** @param:
            dataArray: is an array, each element will be a record.
            callbackFunction: function(err, newDoc)
        **/
        insert: function(dataArray, callbackFunction) {
            var self = this;
            self._insertAdvanced(dataArray, callbackFunction);
        },

        /** @param:
            data: anything, this is data will be update
            callbackFunction: function(err, numAffected, affectedDocuments)

            @usage:
            var db = new DbProvider({datastore: 'anyname'});
            db.reset().where({...}).update(data, callbackFunction);
        **/
        update: function(data, callbackFunction) {
            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
            try {
                self._db.update(self._where, { $set: data }, { multi: true, upsert: true }, function(err, numAffected, affectedDocuments) {
                    callback(err, numAffected, affectedDocuments);
                });
            } catch (ex) {
                console.log('DbProvider - update exception: ', ex);
                callback('CANNOT_UPDATE_DATA', null);
            }
        },

        /** @param:
            callbackFunction: function(err, numRemoved)

            @usage:
            var db = new DbProvider({datastore: 'anyname'});
            db.reset().where({...}).delete(callbackFunction);
        **/
        delete: function(callbackFunction) {
            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
            try {
                self._db.remove(self._where, { multi: true }, function(err, numRemoved) {
                    callback(err, numRemoved);
                });
            } catch (ex) {
                console.log('DbProvider - delete exception: ', ex);
                callback('CANNOT_REMOVE_DATA', null);
            }
        },

        /**@param:
            options = {
                callback(err, numRemoved)
            }
        **/
        clear: function(callbackFunction) {
            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
            self.reset();
            self.delete(callbackFunction);
        },

        /** @param:
            dataArray: is an array, each element will be a record.
            callbackFunction: function(err, newDoc)
        **/
        _insertSimple: function(dataArray, callbackFunction) {
            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
            try {
                self._db.insert(dataArray, function(err, newDoc) {
                    callback(err, newDoc);
                });
            } catch (ex) {
                console.log('DbProvider - _insertSimple exception: ', ex);
                callback('CANNOT_INSERT_DATA', null);
            }
        },

        /** @Function: this function execute only we set unique keys for db.
                In this case, function will check to update exists data, and insert new only.
            @param:
            dataArray: is an array, each element will be a record.
            callbackFunction: function(err, newDoc)
        **/
        _insertAdvanced: function(dataArray, callbackFunction) {

            var self = this,
                callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});

            if (self._options.uniqueKeys.length == 0) {
                self._insertSimple(dataArray, callbackFunction);
                return;
            }

            try {
                var retErr = null,
                    newDoc = [];
                syncLoop(dataArray.length, function(loop) {
                    var i = loop.iteration(),
                        j = 0,
                        len = self._options.uniqueKeys.length,
                        data = dataArray[i],
                        where = {};
                    for (j = 0; j < len; j++) {
                        var uniqueKey = self._options.uniqueKeys[j];
                        where[uniqueKey] = data[uniqueKey];
                    }
                    self.reset().where(where).find(function(err, docs) {
                        var hasChanged = false;
                        if (typeof docs != "undefined" && docs.constructor === Array && docs.length > 0) {
                            var objDoc = docs[0];
                            for (var key in data) {
                                if (data.hasOwnProperty(key) && (typeof objDoc[key] == "undefined" || objDoc[key] != data[key])) {
                                    // This is transaction data
                                    if (typeof objDoc.txid != "undefined" && typeof data.txid != "undefined" && objDoc.txid == data.txid) {
                                        if (typeof objDoc.confirmations != "undefined" && typeof data.confirmations != "undefined") {
                                            if (objDoc.confirmations == 0 && data.confirmations > 0) {
                                                hasChanged = true;
                                            }
                                        }
                                    } else {
                                        hasChanged = true;
                                    }
                                    break;
                                }
                            }
                        }
                        self.reset().where(where).update(data, function(err, numAffected, affectedDocuments) {
                            if (err) {
                                retErr = err;
                            }
                            if (typeof affectedDocuments != "undefined") {
                                newDoc.push(affectedDocuments);
                                loop.next();
                            } else {
                                if (hasChanged) {
                                    self.reset().where(where).find(function(err, docs) {
                                        newDoc.push(docs[0]);
                                        loop.next();
                                    });
                                } else {
                                    loop.next();
                                }
                            }
                        });
                    });
                }, function() {
                    callback(retErr, newDoc);
                });
            } catch (ex) {
                console.log('DbProvider - _insertAdvanced exception: ', ex);
                callback('CANNOT_INSERT_DATA', null);
            }
        }

    };

    window.DbProvider = _DbProvider;

})(window);