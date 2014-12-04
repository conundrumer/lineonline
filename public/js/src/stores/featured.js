var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var FeaturedStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            featured: null
        };
        return this.data
    },

    onMakeFeatured: function(userId, trackId) {
        request
            .put('/api/users/' + userId + '/featured/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    console.log('made track featured!');
                    Actions.getFeatured(userId);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onRemoveFeatured: function(userId, trackId) {
        console.log('can\'t remove featured track yet');
        // request
        //     .del('/api/users/' + userId + '/featured/' + trackId)
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.noContent) {

        //             return;
        //         }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
    },

    onGetFeatured: function(userId) {
        console.log('trying to get featured');
        request
            .get('/api/users/' + userId + '/featured')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    console.log('whoooa got featured');
                    this.data.featured = res.body;
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


module.exports = FeaturedStore;
