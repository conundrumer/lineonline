var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var HomeStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            favorites: []
        };
        return this.data
    },

    onGetFavorites: function() {
        request
            // .get('/api/favorites')
            .get('/api/users/' + 2 + '/tracks')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.favorites = res.body;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});


module.exports = HomeStore;
