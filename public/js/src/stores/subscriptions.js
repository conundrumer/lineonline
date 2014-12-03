var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var SubscriptionsStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            subscriptions: null
        };
        return this.data
    },

    onGetSubscriptions: function() {

        setTimeout(function() {
            var dummyData = [
                {
                    subscribee: {
                        user_id: 1,
                        username: 'dolan',
                        avatar_url: '/images/default.png'
                    },

                    track_snippets: []
                }
            ];
            console.log('sending dummy data');
            this.data.subscriptions = dummyData;
            this.trigger(this.data);
        }.bind(this));
        // request
        //     // .get('/api/subscriptions')
        //     .get('/api/users/' + 2 + '/tracks')
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.favorites = res.body;
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
    }
});


module.exports = SubscriptionsStore;
