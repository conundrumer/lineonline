var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');
var _ = require('underscore');

var SubscriptionsStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            subscriptions: null
        };
        return this.data
    },

    onAddSubscription: function(userId) {
        request
            .put('/api/subscriptions/' + userId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    console.log('subscribed to user');
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onRemoveSubscription: function(userId) {
        request
            .del('/api/subscriptions/' + userId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    console.log('unsubscribed from user!!!');
                    var newSubscriptions = [];
                    for (var i = 0; i < this.data.subscriptions.length; i++) {
                        if (this.data.subscriptions[i].subscribee.user_id !== userId) {
                            newSubscriptions.push(this.data.subscriptions[i]);
                        }
                    }
                    this.data.subscriptions = newSubscriptions;
                    this.trigger(this.data);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetSubscriptions: function() {

        // setTimeout(function() {
        //     var dummyData = [
        //         {
        //             subscribee: {
        //                 user_id: 1,
        //                 username: 'dolan',
        //                 avatar_url: '/images/default.png'
        //             },

        //             track_snippets: []
        //         }
        //     ];
        //     console.log('sending dummy data');
        //     this.data.subscriptions = dummyData;
        //     this.trigger(this.data);
        // }.bind(this));
        request
            .get('/api/subscriptions')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.subscriptions = res.body;
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


module.exports = SubscriptionsStore;
