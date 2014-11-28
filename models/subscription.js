var bookshelf = require('../db/bookshelf.dev');
var User = require('./user');
var Track = require('./track');
var _ = require('underscore');

function toSubscription(subs){
    // var subscriptions = []
    console.log("HERE AAAA");
    var subscribee_id = parseInt(subs.get('subscribee'));
    console.log("HERE BBBB");
    return User.getByID(subscribee_id).then(function(subscribee){
        var get_info = Promise.all([
            subscribee.asUserSnippet(),
            subscribee.getTrackSnippets()
            ]);
        return get_info.then(function(info){
            var userSnippet = info[0];
            var trackSnippets = info[1];
            console.log('SUBSRCIPTIONS ARE: ' + JSON.stringify(info));
            return {subscribee: userSnippet, track_snippets: trackSnippets};
        });


    });

}

var Subscription = bookshelf.Model.extend({
    tableName: 'subscriptions',
    subscriber: function(){
        return this.belongsTo(User, 'subscriber');
    },
    subscribee: function(){
        return this.belongsTo(User, 'subscribee');
    },
    asSubscription: function(){
        console.log('here 1');
        return toSubscription(this);
    }
}, {
    tableName: 'subscriptions',
    build: function (table) {
        table.increments('id').primary();
        table.integer('subscriber').references('users.id');
        table.integer('subscribee').references('users.id');
    },
    create: function(subscriber_id, subscribee_id){
        return Subscription
            .forge({subscribee: subscribee_id, subscriber: subscriber_id})
            .save();
    },
});

module.exports = Subscription;
