var Reflux = require('reflux');
var ErrorActions = require('../actions-error');

var ErrorStore = Reflux.createStore({
    listenables: [ErrorActions],
    onThrowError: function(error) {
        this.trigger(error);
    },
    onThrowUnknownStatus: function(res){
        ErrorActions.throwError({
            message: res.status + res.body ? ': ' + res.body.message : ''
        });
    },
    onAcknowledge: function() {
        this.trigger(null);
    }
});

module.exports =  ErrorStore;
