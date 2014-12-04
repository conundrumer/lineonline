var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var GalleryStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            newTracks: null,
            hotTracks: null,
            topTracks: null
        };
        return this.data
    },
    onGetNewTracks: function(num) {
        console.log('attempting to get new tracks');
        request
            .get('/api/tracks')
            .query({ new: num })
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    console.log('got new tracks');
                    this.data.newTracks = res.body;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },
    onGetHotTracks: function(num) {
        console.log('attempting to get hot tracks');
        request
            .get('/api/tracks')
            .query({ new: num })
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    console.log('got hot tracks');
                    this.data.newTracks = res.body;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },
    onGetTopTracks: function(num) {
        console.log('attempting to get top tracks');
        request
            .get('/api/tracks')
            .query({ new: num })
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    console.log('got top tracks');
                    this.data.newTracks = res.body;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});


module.exports = GalleryStore;
