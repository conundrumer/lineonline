var bookshelf = require('../db/bookshelf.dev');
var User = require('./user');
var Track = require('./track');
var Promise = require('bluebird');
var _ = require('underscore');

var Favorite = bookshelf.Model.extend({
    tableName: 'favorites',
}, {
    tableName: 'favorites',
    build: function (table) {
        table.increments('id').primary();
        table.integer('favoriter').references('users.id');
        table.integer('track').references('tracks.id');
    },
    create: function (user_id, track_id) {
        return Favorite
            .forge({favoriter: user_id, track: track_id})
            .save();
    }
});

module.exports = Favorite;
