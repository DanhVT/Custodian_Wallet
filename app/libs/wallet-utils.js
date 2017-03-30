(function(window, $, undefined) {
    "use strict";
    var Configs = window.Configs;
    var Utils = window.Utils;
    var AltaWallet = window.AltaWallet;
    var WalletModel = window.WalletModel;
    var SettingUtils = window.SettingUtils;
    var WalletAPI = window.WalletAPI;
    var QRImage = window.qrimage;
    var EthereumTokenUtils = window.EthereumTokenUtils;
    var WalletUtils = function() {};
    // ----------------------------------- PUBLIC FUNCTION AND VARIABLES ---------------------------------------
    WalletUtils.cache = {
        listWalletModel: null, // array of WalletModel, each element is the same as _fields in WalletModel.
        currentWallet: null, // is an object return by WalletUtils.parseWalletData function
        transactionSync: null, // instance of TransactionSynchronization
        socketHandler: null // instance of SocketHandler
    };

    WalletUtils.isValidSeed = function(seed) {
        return window.EthereumLibs.Bip39.validateMnemonic(seed);
    }
    WalletUtils.generateSeed = function() {
        // return AltaWallet.wallet.generateMnemonic();
        var seed = window.EthereumLibs.Bip39.generateMnemonic();
        return window.Wallet.generateSeed();
    }

    WalletUtils.parseHref = function(rawContent) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var output = $sce.trustAsHtml(rawContent.replace(exp, "<a href='$1'>$1</a>"));
        console.log('resolveNewsFeedContent', output);
        return output;
    }
    window.WalletUtils = WalletUtils;
})(window, window.$);