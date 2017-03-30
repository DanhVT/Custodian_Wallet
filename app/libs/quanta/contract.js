(function(window, $, undefined) {
    "use strict";

    var randao = {
        name: 'randao',
        displayName: 'Randao smart-contract',
        icon: '',
        address: '0x17f836c258b57a5beaad46296ec26f1de4442526x',
        functions: [{
                name: 'init',
                displayName: 'Init',
                multiSig: true
            },
            {
                name: 'start',
                displayName: 'start',
                hide: true,
                multiSig: false
            }
        ],
        events: ['LogCampaignInit'],
        functionAbi: {},
        eventAbi: {},
    }

    var lottery = {
        name: 'lottery',
        displayName: 'lottery smart-contract',
        icon: '',
        address: '0xaa5bf8bca6ee167ade58bce3d7088188c1f41f7f',
        functions: [{
                name: 'start',
                displayName: 'start',
                multiSig: false

            },
            {
                name: 'stop',
                displayName: 'stop',
                multiSig: true
            },
            {
                name: 'moveFund',
                displayName: 'Move fund',
                multiSig: true
            }
        ],
        events: ['LogCampaignInit'],
        functionAbi: {},
        eventAbi: {},
    }

    var contracts = [randao, window.lotteryContractConfig, window.multisigContractConfig];

    // Read *.abi files
    var appPath = window.FileCommon.getAppPath();
    var abiPath = window.FileCommon.joinPath(appPath, 'libs', 'quanta', 'abi');
    var abiFileNames = window.FileCommon.readdir(abiPath);

    window.originalAbi = {};

    for (var i = 0; i < abiFileNames.length; i++) {
        if (abiFileNames[i].endsWith('.abi')) {
            var json = window.FileCommon.readFileAsJson(window.FileCommon.joinPath(abiPath, abiFileNames[i]));
            if (json) {
                window.originalAbi[abiFileNames[i].substring(0, abiFileNames[i].length - 4)] = json;
            }
        }
    }

    // Load abi
    for (var i = 0; i < contracts.length; i++) {
        console.log('load ', contracts[i].name);

        for (var j = 0; j < contracts[i].functions.length; j++) {
            var fData = contracts[i].functions[j];
            var abi = window.originalAbi[fData.realContractName];
            if (!abi) {
                continue;
            }

            for (var k = 0; k < abi.length; k++) {
                if (abi[k].type == 'function' && abi[k].name == fData.name) {
                    console.log('load function ', k);
                    contracts[i].functionAbi[fData.name] = abi[k];
                }
            }
        }

        for (var j = 0; j < contracts[i].events.length; j++) {
            var eData = contracts[i].events;
            var abi = window.originalAbi[eData.realContractName];
            if (!abi) {
                continue;
            }

            for (var k = 0; k < abi.length; k++) {
                if (abi[k].type == 'event' && abi[k].name == eData.name) {
                    console.log('load event ', k);
                    contracts[i].eventAbi[eData.name] = abi[k];
                }
            }
        }
    }




    window.Contracts = contracts;

})(window, window.$);