var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var CurrentUserStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            profile: null
        };
        return this.data
    },
    onGetCurrentProfile: function(userId) {
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

    onUpdateCurrentProfile: function(userId, userProfile) {
        request
            .put('/api/profile')
            .send(userProfile)
            .end(function(err, res) {
                console.log('ended');
                if (res.status === StatusTypes.ok) {
                    this.data.profile = res.body;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.profileData.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));


            // .end(function(err, res) {
            //     console.log(res);
            //     if (res.status === StatusTypes.ok) {
            //         console.log('UPDATING PROFIELEEE WOOHOO');
            //         this.data.profile = res.body;
            //         this.trigger(this.data);
            //         return;
            //     }
            //     console.log('unknown status: ', res.status);
            // }.bind(this));
    },

});

module.exports = CurrentUserStore;
