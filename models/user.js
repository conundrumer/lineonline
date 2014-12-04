var bookshelf = require('../db/bookshelf.dev');
var Track = require('./track');
var Subscription = require('./subscription');
var _ = require('underscore');
var Promise = require('bluebird');
var crypto = require('crypto');
var crypto_alg = 'aes-256-ctr';
var crypto_password = 'delu';

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
    return {
        username: body.username,
        password: body.password,
        email: body.email,
        avatar_url: DEFAULT_AVATAR_URL,
        about: '',
        location: ''
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
    initialize: function() {
        this.on('creating', this.hashPassword, this);
    },
    // http://lollyrock.com/articles/nodejs-encryption/
    hashPassword: function() {
        var cipher = crypto.createCipher(crypto_alg, crypto_password);
        var crypted = cipher.update(this.get('password'),'utf8','hex')
        crypted += cipher.final('hex');
        this.set('password', crypted);
    },
    tracks: function(){
        return this.hasMany('Track', 'owner');
    },
    asUserProfile: function() {
        return toUserProfile(this);
    },
    subscriptions: function(){
        return this.belongsToMany('User', 'subscriptions', 'subscriber', 'subscribee');
    },
    subscribers: function(){
        return this.belongsToMany('User', 'subscriptions', 'subscribee', 'subscriber');
    },
    invitations: function() {
        return this.belongsToMany('Track', 'invitations', 'invitee', 'track');
    },
    collaborations: function(){
        return this.belongsToMany('Track', 'collaborations', 'collaborator', 'track');
    },
    favorites: function(){
        return this.belongsToMany(Track, 'favorites', 'favoriter', 'track');
    },
    asUserSnippet: function() {
        return toUserSnippet(this);
    },
    getTrackSnippets: function () {
        var userSnippet = this.asUserSnippet();
        return this.tracks().fetch().then(function(trackResults) {
            return Promise.map(trackResults.models, function (track) {
                    return track
                        .asTrackSnippet(userSnippet);
                });
        });
    },
    update: function(body) {
        var newProfile = {
            avatar_url: body.avatar_url || this.get('avatar_url'),
            email: body.email || this.get('email'),
            location: body.location || this.get('location'),
            about: body.about || this.get('about')
        };
        return this.save(newProfile, { patch: true });
    }
}, {
    tableName: 'users',
    build: buildUserTable,
    create: function(body) {
        return User.forge(toUserModel(body)).save();
    },
    getByID: function (id) {
        return User.forge({id: id}).fetch({require: true});
    }

});

module.exports = bookshelf.model('User', User);
