(function(window, undefined) {
    "use strict";

    var DbProvider = window.DbProvider;

    function WalletModel() {
        this._fields = {
            key: 'string',
            name: 'string',
            data: 'object',
            created: 'number', // timestamp in milisecond
            txSyncCompleted: 'boolean',
            balance: ''
        };
        this._datastore = 'wallet';
        this._uniqueKeys = ['key'];
        DbProvider.call(this, {
            datastore: this._datastore,
            uniqueKeys: this._uniqueKeys
        });
    }
    WalletModel.prototype = Object.create(DbProvider.prototype);
    WalletModel.prototype.constructor = WalletModel;

    window.WalletModel = WalletModel;

})(window);