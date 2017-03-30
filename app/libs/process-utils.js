(function(window, $, undefined) {
    "use strict";
    var { ipcRenderer, remote } = require('electron');
    var Configs = window.Configs;
    var Utils = window.Utils;
    var SettingUtils = window.SettingUtils;
    var WalletAPI = window.WalletAPI;
    var WalletUtils = window.WalletUtils;
    var WalletModel = window.WalletModel;
    var Integration = window.Integration;
    var EthereumTokenUtils = window.EthereumTokenUtils;
    var ProcessUtils = function() {
        this.isSynchronizingPrice = false;
    };

    // ----------------------------------- PUBLIC FUNCTION AND VARIABLES ---------------------------------------

    ProcessUtils.appStart = function(callbackFunction) {
        console.log(1)
        SettingUtils.checkDefaultSettings(function() {
            console.log(2)
            ProcessUtils.processStart(callbackFunction);
        });
    };

    /**
        @param:
        callbackFunction: function(err, landingPage){}
    **/
    ProcessUtils.processStart = function(callbackFunction) {
        console.log(3)
        var cb = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        var langCode = 'en';
        moment.locale(langCode);

        SettingUtils.updateSetting('defaultLanguage', langCode, function(err) {
            console.log('process start ');
            ProcessUtils.loadWalletFromDatabase(function(err, wallet) {
                if (err) {
                    throw err;
                }
                if (!wallet) {
                    return cb(null, Configs.pages.createWalletPage)
                }

                ProcessUtils._finalProcess(function(err) {
                    cb(null, Configs.pages.dashBoardPage);
                });
            })
        });
    }

    /**
     * Load wallet data from database then init wallet
     */
    ProcessUtils.loadWalletFromDatabase = function(cb) {
        window.Wallet.loadFromDatabase(function(err, wallet) {
            if (err) {
                return cb(err);
            }

            if (!wallet) {
                return cb(null, null);
            }

            WalletUtils.cache.currentWallet = wallet;
            var activeAccount = SettingUtils.getActiveAccount();
            if (!activeAccount || !wallet.accounts[activeAccount]) {
                for (var k in wallet.accounts) {
                    SettingUtils.setActiveAccount(k);
                    activeAccount = k;
                    break;
                }
            }
            wallet.activeAccount = activeAccount;
            cb(null, wallet)
        });
    }

    /**
        @param:
        callbackFunction: function(err, landingPage){}
    **/
    ProcessUtils.changeWallet = function(walletKey, callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
        try {
            // Check cache
            var cacheWallet = WalletUtils.getWalletFromCache(walletKey);
            if (cacheWallet != null) {
                // Cache it to the currentWallet
                WalletUtils.cache.currentWallet = cacheWallet;
                SettingUtils.updateSetting('latestUsedWalletKey', walletKey, function() {
                    ProcessUtils._finalProcess(function(err) {
                        callback(null, Configs.pages.dashBoardPage);
                    });
                });
                return;
            }

            // get from DB
            WalletUtils.getWalletData(walletKey, function(err, objWallet) {
                if (!err && objWallet != null) {
                    // Cache it to the currentWallet
                    WalletUtils.cache.currentWallet = objWallet;
                    SettingUtils.updateSetting('latestUsedWalletKey', walletKey, function() {
                        ProcessUtils._finalProcess(function(err) {
                            callback(null, Configs.pages.dashBoardPage);
                        });
                    });
                } else {
                    callback('WALLET_NOT_FOUND', Configs.pages.createWalletPage);
                }
            });
        } catch (ex) {
            console.log('ProcessUtils.changeWallet exception: ', ex);
            callback('UNKNOW_ERROR', null);
        }
    }

    /**
        @param:
        callbackFunction: function(err){}
    **/
    ProcessUtils._finalProcess = function(callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {}),
            objWallet = WalletUtils.cache.currentWallet;

        if (objWallet == null) {
            callback('NO_WALLET_FOUND', null);
            return;
        }

        // Init socket
        SocketHandler.init();
        callback();
        // qaw: remove
        // Load last balance from db
        // ProcessUtils.getLastBalanceFromDb(function (err, lastBalance) {
        //     if (err) {
        //         console.log(err);
        //     }

        //     // Load coin price and exchange information from db
        //     ProcessUtils.loadPriceFromDb(function (e, d) {
        //         console.log('d: ', d)
        //         if (d) {
        //             // Raise event to draw chart
        //             AngularUtils.broadcast(Configs.eventNames.changePrice, d);
        //         }
        //         callback();

        //         (function (d) {
        //             setTimeout(function () {
        //                 // Get all balance
        //                 ProcessUtils.getAllBalanceCurrentWallet(function (err, balanceChanged) {
        //                     if (err) {
        //                         console.log('_finalProcess1:', err);
        //                     }
        //                     // Get coin price and exchange rate
        //                     ProcessUtils.getPrice(function (err, data, hasChanged) {
        //                         if (err) {
        //                             console.log('_finalProcess2:', err);
        //                         }

        //                         if (balanceChanged || hasChanged) {
        //                             // Broadcast to re-draw chart
        //                             AngularUtils.broadcast(Configs.eventNames.changePrice, d);
        //                         }
        //                         if (balanceChanged) {
        //                             // Broadcast balance changed
        //                             AngularUtils.broadcast(Configs.eventNames.balanceChanged, {
        //                                 balanceChanged: balanceChanged
        //                             });
        //                         }

        //                         // Get transaction history
        //                         ProcessUtils.syncCurrentWalletData(function (err) {
        //                             if (err) {
        //                                 console.log('_finalProcess3:', err);
        //                             }
        //                             // Create socket
        //                             if (WalletUtils.cache.socketHandler != null) {
        //                                 WalletUtils.cache.socketHandler.destroy();
        //                                 WalletUtils.cache.socketHandler = null;
        //                             }
        //                             WalletUtils.cache.socketHandler = new SocketHandler(objWallet);

        //                             // No need to wait for all wallet to be sync, just need for current wallet completed.
        //                             //callback(null);

        //                             // Sync all other wallet
        //                             ProcessUtils._syncAllWalletData(function (err) {

        //                             });

        //                         });
        //                     });
        //                 });
        //             }, 0);
        //         })(d);
        //     });
        // });

    }

    /**
        @param:
        callbackFunction: function(err, balanceChanged){}
    **/
    ProcessUtils.getAllBalanceCurrentWallet = function(callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {}),
            objWallet = WalletUtils.cache.currentWallet,
            balanceChanged = false;

        if (objWallet == null) {
            callback('NO_WALLET_FOUND', balanceChanged);
            return;
        }

        var arrCoinsInfo = objWallet.arrCoinsInfo,
            dataArray = [],
            dataEthereumGroup = [],
            requestFunction = "getBalance",
            requestData = {
                call: requestFunction,
                data: []
            };

        for (var i = 0; i < objWallet.accounts.length; i++) {
            dataEthereumGroup.push({
                "name": item.name,
                "network": item.network,
                "addresses": [item.address],
            });
        }
        var balanceChanged = false;
        async.eachOfSeries(objWallet.accounts, function(value, key, esCb) {
            WalletAPI.getBalance(key, function(err, balance) {
                if (err) {
                    return esCb(err);
                }
                if (balance != value.balance) {
                    objWallet.accounts[key].balance = balance;
                    balanceChanged = true;
                }
            })
        }, function() {
            if (!balanceChanged) {
                AngularUtils.applyRootScope();
                return callback(null, balanceChanged);
            }

            objWallet.saveToDatabase(function(err) {
                if (err) {
                    throw err;
                }

                AngularUtils.applyRootScope();
                callback(null, balanceChanged);
            })
        })

        // for (var i = 0; i < arrCoinsInfo.length; i++) {
        //     var item = arrCoinsInfo[i];
        //     if (!EthereumTokenUtils.isEthereumGroup(item.name)) {
        //         requestData.data.push({
        //             "network": item.network,
        //             "addresses": [item.address],
        //         });
        //     } else {
        //         dataEthereumGroup.push({
        //             "name": item.name,
        //             "network": item.network,
        //             "addresses": [item.address],
        //         });
        //     }
        // }

        // dataArray.push(requestData);

        // WalletAPI.apiRequest(dataArray, function (err, data) {
        //     try {
        //         if ((err || typeof data[requestFunction] != "object" || !data[requestFunction])) {
        //             callback('GET_ALL_BALANCE_ERR', balanceChanged);
        //             return;
        //         }
        //         var dataBalance = data;
        //         async.eachSeries(dataEthereumGroup, function (dataItem, callbackSeries) {
        //             var network = dataItem.network,
        //                 address = dataItem.addresses[0];
        //             WalletAPI.getBalance(dataItem.name, address, function (err, data) {
        //                 if (err) {
        //                     callbackSeries(err, null);
        //                 } else {
        //                     var objEthereumGroup = {};
        //                     objEthereumGroup[address] = {
        //                         balance: data,
        //                         unconfirmed_balance: 0
        //                     }
        //                     dataBalance[requestFunction][network] = objEthereumGroup;
        //                     callbackSeries();
        //                 }
        //             });
        //         }, function doneEachSeries() {
        //             var balances = {};
        //             for (var i = 0; i < arrCoinsInfo.length; i++) {
        //                 var item = arrCoinsInfo[i],
        //                     funcData = dataBalance[requestFunction];
        //                 if (typeof funcData[item.network] != "undefined" && typeof funcData[item.network][item.address] != "undefined") {
        //                     var newBalance = funcData[item.network][item.address]['balance'];

        //                     // Due with server error(sometime server return balance = null)
        //                     if (newBalance === null || newBalance === undefined || newBalance === '') {
        //                         newBalance = objWallet.arrCoinsInfo[i].balance;
        //                     }

        //                     newBalance = Utils.convertNumber(newBalance);
        //                     if (objWallet.arrCoinsInfo[i].balance != newBalance) {
        //                         balanceChanged = true;
        //                     }
        //                     objWallet.arrCoinsInfo[i].balance = newBalance;
        //                     balances[objWallet.arrCoinsInfo[i].name] = newBalance;
        //                 }
        //             }

        //             // Save balance to db
        //             ProcessUtils.saveLastBalance(balances, function (err) {
        //                 if (err) {
        //                     console.log('Can not save balance');
        //                     console.log(err);
        //                 }
        //             });

        //             AngularUtils.applyRootScope();
        //             callback(null, balanceChanged);

        //         });


        //     } catch (ex) {
        //         console.log('ProcessUtils.getAllBalanceCurrentWallet exception: ', ex);
        //         callback('UNKNOW_ERROR', balanceChanged);
        //     }
        // });
    }

    /**
        @param:
        callbackFunction: function(err){}
    **/
    ProcessUtils.syncCurrentWalletData = function(callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {}),
            objWallet = WalletUtils.cache.currentWallet;

        if (objWallet == null) {
            callback('NO_WALLET_TO_SYNC');
            return;
        }

        // If already complete get newest txs only
        var getNewTxsOnly = (typeof objWallet.txSyncCompleted == 'boolean' && objWallet.txSyncCompleted);

        // Create transaction synchronization
        if (WalletUtils.cache.transactionSync != null) {
            WalletUtils.cache.transactionSync.destroy();
            WalletUtils.cache.transactionSync = null;
        }
        WalletUtils.cache.transactionSync = new TransactionSynchronization(objWallet, getNewTxsOnly);
        WalletUtils.cache.transactionSync.start(function(err, objResult) {

            // Update status into DB
            var db = new WalletModel();
            db.reset().where({ 'key': objWallet.key }).update({ 'txSyncCompleted': true }, function() {

                // update back to cache
                WalletUtils.cache.currentWallet.txSyncCompleted = true;

                //console.log('ProcessUtils.syncCurrentWalletData: completed: ', objResult);

                var arrCoinsInfo = objWallet.arrCoinsInfo;

                for (var i = 0; i < arrCoinsInfo.length; i++) {
                    var item = arrCoinsInfo[i],
                        address = item.address;
                    if (typeof objResult[address].arrNewTxs != "undefined" && objResult[address].arrNewTxs.constructor === Array && objResult[address].arrNewTxs.length > 0) {
                        // Broadcast event
                        var broadcastData = {
                            address: address,
                            result: objResult[address].arrNewTxs,
                            onNewBlock: false
                        };
                        AngularUtils.broadcast(Configs.eventNames.newTxUpdated, broadcastData);
                    }
                }

                callback(null);

            });
        });
    }

    /**
        @param:
        callbackFunction: function(err){}
    **/
    ProcessUtils._syncAllWalletData = function(callbackFunction) {
        var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {}),
            arr = WalletUtils.cache.listWalletModel;

        if (arr == null || arr.length == 0) {
            callback('WALLET_LIST_EMPTY_TO_SYNC');
            return;
        }

        var transactionSync = null;

        syncLoop(arr.length, function(loop) {
            var i = loop.iteration(),
                objWallet = WalletUtils.parseWalletData(arr[i]);

            if (typeof objWallet.txSyncCompleted == 'boolean' && objWallet.txSyncCompleted) {
                loop.next();
            } else {
                // Create transaction synchronization
                if (transactionSync != null) {
                    transactionSync.destroy();
                    transactionSync = null
                }
                transactionSync = new TransactionSynchronization(objWallet, false);
                transactionSync.start(function(err) {

                    // Update status into DB
                    var db = new WalletModel();
                    db.reset().where({ 'key': objWallet.key }).update({ 'txSyncCompleted': true }, function() {

                        // update back to cache
                        WalletUtils.cache.listWalletModel[i].txSyncCompleted = true;

                        loop.next();

                        console.log('next');

                    });
                });
            }
        }, function() {
            console.log('ProcessUtils._syncAllWalletData: completed');
            callback(null);
        });
    }


    /**
     * Get coin price and exchange rate from api
     */
    ProcessUtils.getPrice = function(cb) {
        var priceChanged = false,
            rateChanged = false;

        if (!WalletUtils.cache || !WalletUtils.cache.currentWallet || !WalletUtils.cache.currentWallet.arrCoinsInfo) {
            return cb('WALLET_HAS_NOT_INIT', null, priceChanged || rateChanged);
        }

        var arrCoinsInfo = WalletUtils.cache.currentWallet.arrCoinsInfo;

        // Load coin price and exchange rate
        WalletAPI.getPrice(function(err, price) {
            if (err || typeof price != 'object') {
                return cb('GET_PRICE_ERR', null, priceChanged || rateChanged);
            }

            for (var i = 0; i < arrCoinsInfo.length; i++) {
                var coinName = arrCoinsInfo[i].name.replace(Configs.testnetString, '');
                if (price[coinName]) {
                    if (typeof arrCoinsInfo[i].price == "undefined" || arrCoinsInfo[i].price.price_usd != price[coinName].price_usd) {
                        priceChanged = true;
                    }
                    WalletUtils.cache.currentWallet.arrCoinsInfo[i].price = price[coinName];
                }
            }

            WalletAPI.getExchangeRate(function(err, rate) {
                if (err || typeof rate != 'object') {
                    return cb('GET_EXCHANGE_RATE_ERR', null, priceChanged || rateChanged);
                }
                if (rate) {
                    rate.USD = 1;
                }
                WalletUtils.cache.currentWallet.exchangeRate = rate;

                AngularUtils.applyRootScope();

                var data = {
                    price: price,
                    rate: rate
                };

                SettingUtils.updateSetting('latestPrice', data, function() {
                    // Broadcast event
                    return cb(null, data, priceChanged || rateChanged);
                });
            });

        });
    }

    ProcessUtils.prototype.updatePriceCycling = function() {
        var self = this;

        setInterval(function() {
            if (self.isSynchronizingPrice) {
                console.log('Price is synchronizing');
                self.isSynchronizingPrice = false;
                return;
            } else {
                self.isSynchronizingPrice = true;
                ProcessUtils.getPrice(function(e, d, hasChanged) {
                    if (e) {
                        console.log('synchronization price fail', e);
                    } else if (typeof d == 'object') {
                        SettingUtils.updateSetting('latestPrice', d, function() {
                            self.isSynchronizingPrice = false;
                            console.log('synchronization price finish');
                        });
                        if (hasChanged) {
                            AngularUtils.broadcast(Configs.eventNames.changePrice, d);
                        }
                    }
                });
            }
        }, Configs.updatePriceInterval);
    }

    ProcessUtils.loadPriceFromDb = function(cb) {
        SettingUtils.getSetting('latestPrice', function(e, d) {
            if (e) {
                return cb(e, null);
            } else if (d) {
                if (!WalletUtils.cache || !WalletUtils.cache.currentWallet || !WalletUtils.cache.currentWallet.arrCoinsInfo) {
                    return cb('WALLET_HAS_NOT_INIT', null);
                }

                var price = d.price;
                var rate = d.rate;

                var arrCoinsInfo = WalletUtils.cache.currentWallet.arrCoinsInfo;

                for (var i = 0; i < arrCoinsInfo.length; i++) {
                    var coinName = arrCoinsInfo[i].name.replace(Configs.testnetString, '');
                    if (price[coinName]) {
                        WalletUtils.cache.currentWallet.arrCoinsInfo[i].price = price[coinName];
                    }
                }

                WalletUtils.cache.currentWallet.exchangeRate = rate;

                return cb(null, d);
            } else {
                cb('NO_RATE', null);
            }
        });
    }

    ProcessUtils.trackPageview = function(page) {
        console.log('trackPageview: ' + page);
        ga_storage._trackPageview(page);
    }

    ProcessUtils.integrate = function(cb) {
        SettingUtils.getSetting('integrate', function(err, data) {
            if (data == null) {
                var it = new Integration(Configs.testnet);
                it.synchronize(cb);
            } else {
                return cb();
            }
        })

    }
    var pu = new ProcessUtils();
    pu.updatePriceCycling();

    /**
     * Save wallet balance to db(setting table)
     */
    ProcessUtils.saveLastBalance = function(balance, cb) {
        if (!WalletUtils.cache || !WalletUtils.cache.currentWallet || !WalletUtils.cache.currentWallet.arrCoinsInfo) {
            return cb('WALLET_HAS_NOT_INIT');
        }
        var key = 'balance' + WalletUtils.cache.currentWallet.key;
        console.log('save: ' + key)
        SettingUtils.updateSetting(key, balance, function(err) {
            return cb(err);
        });
    }

    /**
     * Get wallet balance from database
     */
    ProcessUtils.getLastBalanceFromDb = function(cb) {
        if (!WalletUtils.cache || !WalletUtils.cache.currentWallet || !WalletUtils.cache.currentWallet.arrCoinsInfo) {
            return cb('WALLET_HAS_NOT_INIT', null);
        }
        var key = 'balance' + WalletUtils.cache.currentWallet.key;
        SettingUtils.getSetting(key, function(err, data) {
            if (data == null || err) {
                return cb(err);
            } else {

                var arrCoinsInfo = WalletUtils.cache.currentWallet.arrCoinsInfo;
                for (var i = 0; i < arrCoinsInfo.length; i++) {
                    if (data[arrCoinsInfo[i].name]) {
                        WalletUtils.cache.currentWallet.arrCoinsInfo[i].balance = data[arrCoinsInfo[i].name];
                    }
                }

                return cb(null, data);
            }
        })
    }

    // ----------------------------------- PRIVATE FUNCTION AND VARIABLES ---------------------------------------

    window.ProcessUtils = ProcessUtils;

})(window, window.$);