var bookshelf = require('../db/bookshelf.dev');
var User = require('./user');
var Track = require('./track');
var _ = require('underscore');

// favorites are simply arrays with track ids
// dolan: favorites: [track_ids.dolan[0]]

var Favorite = bookshelf.Model.extend({
    tableName: 'favorites',
}, {
    tableName: 'favorites',
    build: function (table) {
        table.increments('id').primary();
        table.integer('favoriter').references('users.id');// .notNullable();
        table.integer('track').references('tracks.id');// .notNullable();
    },

    create: function (user_id, track_id) {
        return Favorite
            .forge({favoriter: user_id, track: track_id})
            .save();
    }
});

module.exports = Favorite;
