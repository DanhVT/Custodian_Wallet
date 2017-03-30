(function(window, undefined) {
    'use strict';

    var Configs = {};

    Configs.debug = true;

    Configs.testnet = false;
    Configs.testnetString = Configs.testnet ? 'Testnet' : '';

    Configs.dateFormat = 'YYYY-MM-DD';
    Configs.timeFormat = 'HH:mm:ss';
    Configs.dateTimeFormat = Configs.dateFormat + ' ' + Configs.timeFormat;

    Configs.ethereumDefaultGas = 21000; //wei
    Configs.ethereumSmartContractGas = 100000; //wei

    Configs.servers = {};
    Configs.servers.autoUpdater = 'http://45.118.132.125';
    // Configs.servers.autoUpdater = 'http://192.168.0.105:1337';
    Configs.servers.httpServerUrl = Configs.testnet ? 'http://blocktest.altaapps.io' : 'https://block.altaapps.io';
    Configs.servers.checkVersionUrl = Configs.servers.httpServerUrl + '/api/checkversion';
    Configs.servers.checkNewFeed = 'https://quantawallet.firebaseio.com/newsfeed.json';

    Configs.servers.getUnspentUrl = Configs.servers.httpServerUrl + '/api/get_tx_unspent/{network}/{address}';
    Configs.servers.sendRawTransactionUrl = Configs.servers.httpServerUrl + '/api/send_raw_transaction/{network}';
    Configs.servers.getTransactionUrl = Configs.servers.httpServerUrl + '/api/get_transactions_byaddress/{network}/{address}';
    Configs.servers.getTransactionCountUrl = Configs.servers.httpServerUrl + '/api/get_transaction_count/{network}/{address}';
    Configs.servers.getBalanceUrl = Configs.servers.httpServerUrl + '/api/get_address_balance/{network}/{address}';
    Configs.servers.networkWrapApiUrl = Configs.servers.httpServerUrl + '/api';
    Configs.servers.bitcoinSocketUrl = Configs.testnet ? 'http://blocktest.altaapps.io:7666' : 'http://ws.altaapps.io';
    Configs.servers.ethereumSocketUrl = 'wss://socket.etherscan.io/wshandler';
    Configs.servers.checkSmartContractUrl = 'http://api.etherscan.io/api?module=proxy&action=eth_getCode&address={address}&tag=latest';
    Configs.servers.priceUrl = Configs.servers.httpServerUrl + '/api/get_price';
    Configs.servers.exchangeRateUrl = Configs.servers.httpServerUrl + '/api/get_exchange_rate';

    Configs.bitcoin = 'bitcoin' + Configs.testnetString;
    Configs.litecoin = 'litecoin' + Configs.testnetString;
    Configs.dogecoin = 'dogecoin' + Configs.testnetString;
    Configs.ethereum = 'ethereum' + Configs.testnetString;
    Configs.dash = 'dash' + Configs.testnetString;
    Configs.qnt = 'qnt' + Configs.testnetString;
    // Configs.digixdao = 'digixdao' + Configs.testnetString;
    Configs.supportCoinsOrder = [Configs.bitcoin, Configs.ethereum, Configs.qnt]; //, Configs.litecoin, Configs.dogecoin, Configs.dash, Configs.digixdao

    Configs.ethereumGroup = [Configs.ethereum]; // Configs.digixdao
    // Url for ethereum group
    Configs.servers.httpServerEthereumUrl = Configs.testnet ? 'https://testnet.etherscan.io' : 'https://api.etherscan.io';
    Configs.ethereumGroupUrl = {};

    Configs.ethereumGroupUrl.getTransactionCount = Configs.servers.httpServerEthereumUrl + '/api?module=proxy&action=eth_getTransactionCount&address={address}&tag=latest';
    Configs.ethereumGroupUrl.sendRawTransactionUrl = Configs.servers.httpServerEthereumUrl + '/api?module=proxy&action=eth_sendRawTransaction&hex=';

    Configs.ethereumGroupUrl[Configs.ethereum] = {
        getBalanceUrl: Configs.servers.httpServerEthereumUrl + '/api?module=account&action=balance&address={address}&tag={status}',
        getTransactionsUrl: Configs.servers.httpServerEthereumUrl + '/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page={page}&offset={limit}&sort=desc',
    };
    Configs.ethereumGroupUrl[Configs.digixdao] = {
        getBalanceUrl: Configs.servers.httpServerEthereumUrl + '/api?module=account&action=tokenbalance&tokenname=DGD&address={address}&tag={status}'
    };

    // Smartcontract address: 
    Configs.servers.qntContractAddress = Configs.testnet ? "0x92532d73b96345b778719948d15520a552f96b2b" : "0xcb3bc50b407c8ec5d75ede4cb935993d6c200490";

    Configs.ethereumGroupUrl[Configs.qnt] = {
        getBalanceUrl: Configs.servers.qntServerUrl + "socket/balance?useraddress={address}",
        getBalanceFromEtherscan: Configs.servers.httpServerEthereumUrl + '/api?module=account&action=tokenbalance&contractaddress=' + Configs.servers.qntContractAddress + '&address={address}&tag=latest'
    };


    Configs.supportCoins = {};
    Configs.supportCoins[Configs.bitcoin] = {
        name: Configs.bitcoin,
        network: 'BTC',
        unit: 'satoshi',
        rate: 100000000,
        fractionSize: 6,
    };
    // Configs.supportCoins[Configs.litecoin] = {
    //     name: Configs.litecoin,
    //     network: 'LTC',
    //     unit: 'satoshi',
    //     rate: 100000000,
    //     fractionSize: 4,
    // };
    // if (!Configs.testnet) {
    //     Configs.supportCoins[Configs.dogecoin] = {
    //         name: Configs.dogecoin,
    //         network: 'DOGE',
    //         unit: 'satoshi',
    //         rate: 100000000,
    //         fractionSize: 2,
    //     };
    //}
    Configs.supportCoins[Configs.ethereum] = {
        name: Configs.ethereum,
        network: 'ETH',
        unit: 'wei',
        rate: 1000000000000000000,
        fractionSize: 4,
    };
    // if (!Configs.testnet) {
    //     Configs.supportCoins[Configs.dash] = {
    //         name: Configs.dash,
    //         network: 'DASH',
    //         unit: 'satoshi',
    //         rate: 100000000,
    //         fractionSize: 4
    //     };
    // }

    //if (!Configs.testnet) {
    Configs.supportCoins[Configs.qnt] = {
        name: Configs.qnt,
        network: 'QNT',
        unit: 'wei',
        rate: 1000000000000000000,
        fractionSize: 4,
    };
    //}
    // if (!Configs.testnet) {
    //     Configs.supportCoins[Configs.digixdao] = {
    //         name: Configs.digixdao,
    //         network: 'DGD',
    //         unit: 'satoshi',
    //         rate: 1000000000
    //     };
    // }

    Configs.defaultLang = 'en';

    Configs.langCodeList = ['en', 'jp', 'vi', 'cn'];

    // view state to some pages
    Configs.pages = {
        selectLanguagePage: 'languages.select',
        termsPage: 'languages.termpage',
        createWalletPage: 'register',
        dashBoardPage: 'dashboard' // application entry point
    };

    // Password required
    Configs.password = {
        minLength: 2,
        number: false,
        upperCase: false,
        special: false
    };

    Configs.eventNames = {
        changePrice: 'CHANGE_PRICE',
        newTxNotification: 'NEW_TRANSACTION_NOTIFICATION',
        newTxUpdated: 'NEW_TRANSACTION_UPDATED',
        balanceChanged: 'BALANCE_CHANGED'
    }

    Configs.fiats = {
        USD: { code: 'USD', name: 'USD', sign: '$', fractionSize: 2 },
        JPY: { code: 'JPY', name: 'JPY', sign: '¥', fractionSize: 0 },
        VND: { code: 'VND', name: 'VND', sign: '₫', fractionSize: 0 },
        CNY: { code: 'RMB', name: 'CNY', sign: '¥', fractionSize: 0 }
    }

    Configs.feeSendSetting = {
        high: 'high',
        medium: 'medium',
        low: "low"
    };

    Configs.colors = { 'BTC': '#f6931a', 'LTC': '#c8c8c8', 'DOGE': '#ba9f33', 'ETH': '#61678f', 'DASH': '#2181f4', 'QNT': '#bb9e47' };

    Configs.feeSend = {};
    Configs.feeSend[Configs.bitcoin] = { low: 0.0002, medium: 0.0004, high: 0.0008 };
    Configs.feeSend[Configs.litecoin] = { low: 0.001, medium: 0.003, high: 0.006 };
    Configs.feeSend[Configs.dogecoin] = { low: 0.001, medium: 0.1, high: 1 };
    Configs.feeSend[Configs.ethereum] = { low: 0.00000002, medium: 0.00000003, high: 0.00000004 };
    Configs.feeSend[Configs.dash] = { low: 0.0001, medium: 0.0003, high: 0.0005 };
    Configs.feeSend[Configs.qnt] = { low: 0.00000002, medium: 0.00000003, high: 0.00000004 };

    // Url of blockchains
    Configs.blockchains = {};
    Configs.blockchains[Configs.bitcoin] = 'https://blockexplorer.com/tx/{txid}';
    Configs.blockchains[Configs.litecoin] = 'http://ltc.blockr.io/tx/info/{txid}';
    Configs.blockchains[Configs.dogecoin] = 'https://dogechain.info/tx/{txid}';
    Configs.blockchains[Configs.ethereum] = 'https://etherscan.io/tx/{txid}';
    Configs.blockchains[Configs.dash] = 'https://explorer.dash.org/tx/{txid}';

    // Time interval to update price (ms)
    Configs.updatePriceInterval = 1000 * 60 * 10;
    Configs.updateDataInterval = 1000 * 20;
    Configs.testnetUpdateDataInterval = 1000 * 20;
    Configs.updateTokenBalanceInterval = 1000 * 20;
    Configs.altaAppsWebsite = 'https://altaapps.io/';

    Configs.servers.qntSocketUrl = Configs.testnet ? "http://139.162.19.133:3002/" : "https://qnt-redeem-ws.altaapps.io";
    //Configs.servers.qntSocketUrl = Configs.testnet ? "http://localhost:3003" : "https://qnt-redeem-ws.altaapps.io";
    Configs.servers.qntServerUrl = "http://192.168.1.234:3003/";
    Configs.servers.qntServerSendTxApi = Configs.servers.qntServerUrl + "socket/sendRawTransaction?hex=";
    Configs.servers.qntServerBalanceApi = Configs.servers.qntServerUrl + "socket/balance?useraddress=";
    Configs.servers.qntServerCaptchaApi = Configs.servers.qntServerUrl + "code/captcha";
    Configs.servers.qntServerRedeemApi = Configs.servers.qntServerUrl + "code/redeem";
    Configs.servers.qntServerOtpApi = Configs.servers.qntServerUrl + "code/getOtp";
    Configs.servers.qntServerCheckAddress = Configs.servers.qntServerUrl + "code/checkAddress";
    Configs.servers.qntServerGetTransaction = Configs.servers.qntServerUrl + "transaction/getTransaction";

    Configs.fixedRates = {
        qnt: {
            "price_usd": "0.0014",
            "percent_change_1h": "0",
            "percent_change_24h": "0",
            "percent_change_7d": "0"
        }
    }

    // New config
    Configs.CONSTANT = {
        ROLES: {
            director: 'director',
            manager: 'manager',
            custodian: 'custodian'

        },
        SOCKET: {
            EVENT: {
                NEW_BLOCK: 'new-block',
                CURRENT_BLOCK: 'current-block',
                FINISH_BLOCK: 'finish-block',
                NEW_TX: 'new-tx',
                SUBSCRIBE: 'subscribe',
                MULTISIG: {
                    submission: 'MultiSigSubmission',
                    confirmation: 'MultiSigConfirmation',
                    execution: 'MultiSigExecution',
                    executionFailure: 'MultiSigExecutionFailure'
                }
            },
            ROOM: {
                NEW_BLOCK: 'new-block',
                NEW_TX: 'new-tx',
                SUBSCRIBE: 'subscribe',

                MULTISIG: {
                    MANAGER: 'MULTISIG_MANAGER',
                    DIRECTOR: 'MULTISIG_DIRECTOR',
                    CUSTODIAN: 'MULTISIG_CUSTODIAN',
                }
            },
        },
    }

    Configs.SERVER_ROOT = 'http://localhost:3000';
    Configs.API_ROOT = `${Configs.SERVER_ROOT}/api`;
    Configs.ROLE = Configs.CONSTANT.ROLES.director;

    Configs.SmartContractAddress = {
        LotteryFund: '0xLotteryFund',
        QuantaMultiSigWallet: {
            directorAddress: '0x17f836c258b57a5beaad46296ec26f1de4442526',
            managerAddress: '0xc26111b52a25a5e8c8411527d6e260ae7fd49a55',
            custodianAddress: '0x2123bf79f3ad7b09d2269ca890e67f8f163077e3',
        }
    }


    window.Configs = Configs;

})(window);