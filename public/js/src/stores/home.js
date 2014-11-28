var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var HomeStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            invitations: null,
            yourTracks: null,
            collaborations: null
        };
        return this.data
    },
    onGetInvitations: function() {
        // request
        //     .get('/api/users/' + id + '/profile')
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.profile = res.body;
        //             console.log('got user profile!!!!');
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.profileData.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
        setTimeout(function() {
            this.data.invitations = null;// {};
            this.trigger(this.data);
        }.bind(this));
    },

    onGetYourTracks: function(id) {
        request
            .get('/api/users/' + id + '/tracks')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.yourTracks = res.body;
                    console.log('got your tracks!!!!');
                    console.log(res.body);
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.profileData.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetCollaborations: function() {
        setTimeout(function() {
            this.data.collaborations = null;// {};
            this.trigger(this.data);
        }.bind(this));
    }
});

module.exports = HomeStore;
