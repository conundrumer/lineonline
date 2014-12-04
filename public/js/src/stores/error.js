var Reflux = require('reflux');
var ErrorActions = require('../actions-error');

var ErrorStore = Reflux.createStore({
    listenables: [ErrorActions],
    onThrowError: function(error) {
        this.trigger(error);
    },
    onAcknowledge: function() {
        this.trigger(null);
    }
});

module.exports =  ErrorStore;
