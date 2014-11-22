var bookshelf = require('../db/bookshelf.dev');
var Track = require('./track');

var DEFAULT_AVATAR_URL = '/images/default.png';
var User = bookshelf.Model.extend({
    tableName: 'users',
    tracks: function(){
        return this.hasMany('Track', 'owner');
    },
    // subscriptions: function(){
    //     return this.belongsToMany('User', 'subscriptions', 'subscriber', 'subscribee');
    // },
    // subscribers: function(){
    //     return this.belongsToMany('User', 'subscriptions', 'subscribee', 'subscriber');
    // },
    // // collaborations: function(){
    // //     return this.belongsToMany('User', '')
    // }
    // favorites: function(){
    //     return this.hasMany('Track', 'favorites');
    // },
    asUserSnippet: function() {
        return {
            user_id: this.get('id'),
            username: this.get('username'),
            avatar_url: this.get('avatar_url')
        };
    },
    getTrackSnippets: function () {
        var userSnippet = this.asUserSnippet();
        return this.tracks().fetch().then(function(trackResults) {
            return trackResults.models.map(function (track) {
                return track
                    .asTrackSnippet()
                    .addOwnerSnippet(userSnippet);
            });
        });
    }
}, {
    tableName: 'users',
    build: function (table) {
        table.increments('id').primary();
        table.string('username', 100);
        table.string('password', 100);
        table.string('email', 100);
        table.string('avatar_url', 100);
        table.string('about', 300);
        table.string('location', 100);
    },
    create: function(body) {
        return User.forge({
            username:username,
            password:password,
            email:email,
            avatar_url: DEFAULT_AVATAR_URL
        }).save();
    },
    getByID: function (id) {
        return User.forge({id: id}).fetch({require: true});
    }
});

module.exports = bookshelf.model('User', User);
