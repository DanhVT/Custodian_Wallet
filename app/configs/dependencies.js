var appDependencies = {
    core: [
        'components/angular-material/angular-material.css',

        'components/jquery/dist/jquery.min.js',
        'components/angular/angular.js',
        'components/angular-ui-router/release/angular-ui-router.js',
        'components/angular-translate/angular-translate.js',
        'components/angular-animate/angular-animate.js',
        'components/angular-aria/angular-aria.js',
        'components/angular-messages/angular-messages.js',
        'components/angular-sanitize/angular-sanitize.js',
        'components/angular-material/angular-material.js',
        'components/angular-bootstrap/ui-bootstrap.js',
        'components/moment/moment.js',
        'components/angular-moment/angular-moment.js',
        'components/abi-decoder/dist/abi-decoder.js'
    ],

    libs: [
        //=========== Assets File ==============================
        "assets/css/default.css",
        "components/Font-Awesome/css/font-awesome.css",
        "modules/dashboard/css/dashboard.css",

        //=========== Bower Component ==============================
        "components/Font-Awesome/css/font-awesome.css",
        "components/web3/dist/web3.js",
        "components/jsSHA/src/sha.js",
        "components/wallet-address-validator/dist/wallet-address-validator.min.js",
        "components/zxcvbn/dist/zxcvbn.js",
        "components/async/dist/async.min.js",
        "components/angular-clipboard/angular-clipboard.js",

        //========== Libs ==========================================
        "assets/js/nedb.js",
        "assets/js/syncloop.js",
        "assets/loading/loading.js",
        "configs/config.js",

        "libs/utils.js",
        "libs/utils.ext.js",
        "libs/db-provider.js",
        "libs/angular-utils.js",

        "libs/wallet-model.js",
        "libs/wallet-api.js",
        "libs/wallet-utils.js",

        "libs/setting-model.js",
        "libs/setting-utils.js",
        "libs/process-utils.js",
        //========== Language ======================================
        "i18n/en.js",
        //========== Contract load =================================
        // Contract config
        "libs/quanta/contracts-config/lottery.js",
        "libs/quanta/contracts-config/multisig.js",

        "libs/FileCommon.js",
        "libs/quanta/contract.js"
    ],

    modules: [
        "modules/dashboard/modules.js",
        "modules/dashboard/overview.controller.js",
        "modules/dashboard/overview.directive.js",

        "modules/dashboard/controller.js",
        "modules/dashboard/service.js",

        "modules/dashboard/settingController.js",
        "modules/dashboard/toolbarDirective.js",

        "modules/default/modules.js",

        "modules/languages/modules.js",
        "modules/languages/controller.js",
        "modules/languages/directives.js",

        "modules/register/modules.js",
        "modules/register/controller.js",


    ]
}