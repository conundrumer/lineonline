var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require(__base + 'util/status-types');
var ErrorActions = require('../actions-error');

var FavoritesStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            featuredTrack: null
        };
        return this.data
    },

    onGetGlobalFeaturedTrack: function(trackId) {
        request
            .get('/api/tracks/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.featuredTrack = res.body;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});


module.exports = FavoritesStore;
