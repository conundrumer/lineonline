var User = require('../db/create-model')({
    tableName: 'users',
    build: function (table) {
        table.increments('id').primary();
        table.string('username', 100);
        table.string('password', 100);
        table.string('email', 100);
        table.string('about', 300);
        table.string('location', 100);
    },
    subscriptions: function(){
        return this.belongsToMany(User, 'subscriptions', 'subscriber', 'subscribee');
    },
    subscribers: function(){
        return this.belongsToMany(User, 'subscriptions', 'subscribee', 'subscriber');
    },
    tracks: function(){
        return this.hasMany(Track, 'tracks', 'track_owner', 'owned_tracks');
    }
});

module.exports = User;
