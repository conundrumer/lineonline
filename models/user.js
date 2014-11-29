var bookshelf = require('../db/bookshelf.dev');
var Track = require('./track');
var _ = require('underscore');

function buildUserTable(table) {
    table.increments('id').primary();
    table.string('username', 100).unique().notNullable();
    table.string('password', 100).notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('avatar_url', 100);
    table.string('about', 300);
    table.string('location', 100);
}

// post body -> model
function toUserModel(body) {
    location = '';
    if (body.location != null && body.location != undefined){
        location = body.location;
    }
    if (body.about == null || body.about == undefined){
        body.about = '';
    }
    return {
        username: body.username,
        password: body.password,
        email: body.email,
        avatar_url: DEFAULT_AVATAR_URL,
        about: body.about,
        location: location
    };
}

// model -> representations without related
var DEFAULT_AVATAR_URL = '/images/default.png';
function toUserSnippet(model) {
    return {
        user_id: model.get('id'),
        username: model.get('username'),
        avatar_url: model.get('avatar_url') || DEFAULT_AVATAR_URL
    };
}

function toUserProfile(model) {
    return _.extend(toUserSnippet(model), {
        email: model.get('email'),
        location: model.get('location'),
        about: model.get('about'),
        user_id: model.get('id')
    });
}

var User = bookshelf.Model.extend({
    tableName: 'users',
    tracks: function(){
        return this.hasMany('Track', 'owner');
    },
    asUserProfile: function() {
        return toUserProfile(this);
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
    favorites: function(){
        return this.belongsToMany(Track, 'favorites', 'favoriter', 'track');
    },
    asUserSnippet: function() {
        return toUserSnippet(this);
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
    build: buildUserTable,
    create: function(body) {
        return User.forge(toUserModel(body)).save();
    },
    update: function(body, user_id){
        var userModel = User.forge(toUserModel(body));
        userModel.set({id: user_id});
        return userModel.save().then(function(model){
            return toUserProfile(model);
        });
    },
    getByID: function (id) {
        return User.forge({id: id}).fetch({require: true});
    }
});

module.exports = bookshelf.model('User', User);
