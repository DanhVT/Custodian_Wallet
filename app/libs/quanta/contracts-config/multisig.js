window.multisigContractConfig = {
    name: 'multisig',
    displayName: 'Multisig contract',
    icon: '',
    realContractName: 'QuantaMultiSigWallet',
    address: window.Configs.SmartContractAddress.QuantaMultiSigWallet.directorAddress,
    directorAddress: window.Configs.SmartContractAddress.QuantaMultiSigWallet.directorAddress,
    managerAddress: window.Configs.SmartContractAddress.QuantaMultiSigWallet.managerAddress,
    custodianAddress: window.Configs.SmartContractAddress.QuantaMultiSigWallet.custodianAddress,
    functions: [
        {
            name: 'submitTransaction',
            realContractName: 'QuantaMultiSigWallet',
        },
        {
            name: 'confirmTransaction',
            realContractName: 'QuantaMultiSigWallet',
        }
    ],
    events: ['LogCampaignInit'],
    functionAbi: {},
    eventAbi: {},
    hide: true
}
