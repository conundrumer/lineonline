var bookshelf = require('../db/bookshelf.dev');
var User = require('./user');
var Track = require('./track');
var _ = require('underscore');

var Subscription = bookshelf.Model.extend({
    tableName: 'subscriptions',
    subscriber: function(){
        return this.belongsTo(User, 'subscriber');
    },
    subscribee: function(){
        return this.belongsTo(User, 'subscribee');
    },
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
