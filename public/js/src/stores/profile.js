var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var Data = {
    profile: null,
    collections: null
};

var ProfileStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        return Data;
    },
    onGetProfile: function(id) {
        var context = this;
        request
            .get('/api/users/' + id + '/profile')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    Data.profile = res.body;
                    console.log('got user profile!!!!');
                    this.trigger(Data);
                    return;
                }
                // if (res.notFound) {
                //     Data.profileData.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetCollections: function(id) {
        request
            .get('/api/users/' + id + '/collections')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    Data.collections = res.body;
                    this.trigger(Data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});

module.exports = ProfileStore;
