var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var ProfileStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            profile: null,
            tracks: null,
            featuredTrack: null
        };
        return this.data
    },
    onGetProfile: function(userId) {
        request
            .get('/api/users/' + userId + '/profile')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.profile = res.body;
                    console.log('got user profile!!!!');
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.profileData.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetTrackSnippets: function(userId) {
        request
            .get('/api/users/' + userId + '/tracks')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.tracks = res.body;
                    console.log('got user track snippets!!!!');
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.profileData.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetFeaturedTrack: function(userId) {
        // request
        //     .get('/api/users/' + userId + '/featured')
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.profile = res.body;
        //             console.log('got user featured track!!!!');
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.profileData.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));

        setTimeout(function() {
            this.data.featuredTrack = {};
            this.trigger(this.data);
        }.bind(this));
    }

    // onGetCollections: function(userId) {
    //     request
    //         .get('/api/users/' + userId + '/collections')
    //         .end(function(err, res) {
    //             if (res.status === StatusTypes.ok) {
    //                 this.data.collections = res.body;
    //                 this.trigger(this.data);
    //                 return;
    //             }
    //             console.log('unknown status: ', res.status);
    //         }.bind(this));
    // }
});

module.exports = ProfileStore;
