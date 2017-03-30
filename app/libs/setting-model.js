(function(window, undefined) {
    "use strict";

    var DbProvider = window.DbProvider;

    function SettingModel() {
        this._fields = {
            defaultLanguage: 'string',
            latestUsedWalletKey: 'string',
            latestPrice: 'object',
            isTermsAgreed: 'boolean'
        };
        this._datastore = 'settings';
        this._uniqueKeys = [];
        DbProvider.call(this, {
            datastore: this._datastore,
            uniqueKeys: this._uniqueKeys
        });
    }
    SettingModel.prototype = Object.create(DbProvider.prototype);
    SettingModel.prototype.constructor = SettingModel;

    window.SettingModel = SettingModel;

})(window);