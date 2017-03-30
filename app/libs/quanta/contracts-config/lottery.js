window.lotteryContractConfig = {
    name: 'lottery',
    displayName: 'lottery smart-contract',
    icon: '',
    functions: [
        {
            name: 'moveAllFund',
            displayName: 'Move all fund',
            realContractName: 'LotteryFund',
            realContractAddress: window.Configs.SmartContractAddress['LotteryFund'],
            multiSig: true,
            mutilSigRole: window.Configs.CONSTANT.ROLES.director
        },
        {
            name: 'toggleAllowWithdraw',
            displayName: 'toggleAllowWithdraw',
            realContractName: 'LotteryFund',
            realContractAddress: window.Configs.SmartContractAddress['LotteryFund'],
            multiSig: true,
            mutilSigRole: window.Configs.CONSTANT.ROLES.director
        },
        //-----------------------------------------------------------------------------------
        {
            name: 'toggleActiveSellerContract',
            displayName: 'toggleActiveSellerContract',
            realContractName: 'LotterySeller',
            realContractAddress: window.Configs.SmartContractAddress['LotterySeller'],
            multiSig: false,
            specialProcessFunction: 'toggleActiveSellerContract'
        },
        
    ],
    events: [
        {
            realContractName: 'LotteryFund',
            eventName: 'LogMoveAllFund'
        }
    ],
    functionAbi: {},
    eventAbi: {},
}
