var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var ProfileStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            profile: null,
            collections: null
        };
        return this.data
    },
    onGetProfile: function(id) {
        var context = this;
        request
            .get('/api/users/' + id + '/profile')
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

    onGetCollections: function(id) {
        request
            .get('/api/users/' + id + '/collections')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.collections = res.body;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});

module.exports = ProfileStore;
