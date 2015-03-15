var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require(__base + 'util/status-types');

var TrackStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            track: null
        };
        return this.data
    },
    onGetTrack: function(trackId) {
        console.log('this got called with ', trackId);
        request
            .get('/api/tracks/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    console.log('AJKLFDSJKLADSFJLKAFSJLKAFS');
                    this.data.track = res.body;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});


module.exports = TrackStore;
