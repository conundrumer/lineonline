var User = require('./user');

var Subscription = require('../db/create-model')({
    tableName: 'subscriptions',
    build: function (table) {
        table.increments('id').primary();
        table.integer('subscriber').references('users.id');
        table.integer('subscribee').references('users.id');
    },
    subscriber: function(){
        return this.belongsTo(User, 'subscriber');
    },
    subscribee: function(){
        return this.belongsTo(User, 'subscribee');
    }
});

module.exports = Subscription;
