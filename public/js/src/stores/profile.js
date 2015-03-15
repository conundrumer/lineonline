var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require(__base + 'util/status-types');

var ProfileStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            profile: null,
            tracks: null,
            collaborations: null,
            featuredTrack: null,
        };
        return this.data
    },
    onGetProfile: function(userId) {
        request
            .get('/api/users/' + userId + '/profile')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    console.log("GOT THE USER PROFILE OF ", userId)
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

    onGetCollabSnippets: function(userId) {
        request
            .get('/api/users/' + userId + '/collaborations')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.collaborations = res.body;
                    console.log('got user collab snippets!!!!');
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
        console.log('trying to get featured track for profile');
        request
            .get('/api/users/' + userId + '/featured')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    console.log('GOT FEATURED TRACK FOR PROFILEEEE');
                    this.data.featuredTrack = res.body;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.notFound = true
                // }
                console.log('unknown status: ', res.status);
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
