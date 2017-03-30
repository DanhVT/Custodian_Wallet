(function(window, $, undefined) {
    "use strict";

    var Configs = window.Configs;
    var Utils = window.Utils;
    var EthereumTokenUtils = window.EthereumTokenUtils;
    var WalletAPI = function() {};
    var web3 = new Web3();

    WalletAPI.validateAddress = function(address) {
        return web3.isAddress(address);
    }

    WalletAPI.getBalance = function(address, cb) {
        cb(null, '1000')
    }

    WalletAPI.getNonce = function(address, cb) {
        var url = `${window.Configs.API_ROOT}/addr/${address}/totalTxSent/pending`;
        $.get(url, function(data, status) {
            if (!data) {
                console.log(data);
                console.log(url);
                throw 'getNonce ERROR'
            }

            if (data.error) {
                cb(data.error);
            } else {
                cb(null, data.result);
            }
        });
    }

    WalletAPI.sendRawTransaction = function(txRaw, cb) {
        var url = `${window.Configs.API_ROOT}/tx/send`;
        $.post(url, { txHex: txRaw }, function(data, status) {
            if (!data) {
                throw 'sendRawTransaction undefined data'
            } else if (data.error) {
                cb(data.error);
            } else {
                cb(null, data.result);
            }
        });
    }

    WalletAPI.getCommandNonce = function(hash, cb) {
        var url = `${window.Configs.API_ROOT}/multisig/nonce/${hash}`;
        $.get(url, function(data, status) {
            if (!data) {
                console.log(data);
                console.log(url);
                throw 'getCommandNonce ERROR'
            }

            if (data.error) {
                cb(data.error);
            } else {
                cb(null, data.result);
            }
        });
    }

    WalletAPI.getLatestActivity = function(addr, cb) {
        var url = `${window.Configs.API_ROOT}/wallet/activity/getRecent/${addr}`;
        $.get(url, function(data, status) {
            if (!data) {
                console.log(data);
                console.log(url);
                throw 'getLatestActivity ERROR';
            }

            if (data.error) {
                cb(data.error);
            } else {
                cb(null, data.result);
            }
        });
    }

    window.WalletAPI = WalletAPI;

})(window, window.$);