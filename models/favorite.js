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
        table.integer('favoriter').references('users.id');// .notNullable();
        table.integer('track').references('tracks.id');// .notNullable();
    },

    create: function (user_id, track_id) {
        return Favorite
            .forge({favoriter: user_id, track: track_id})
            .save();
    },

    getFavorites: function (user_id) {
        Track.fetchAll().then(function (tracks){
            console.log("PRINTING ALL TRACKS! " + JSON.stringify(tracks));
        }).then(function (){
            return Favorite.where({favoriter : user_id}).fetchAll().then(function (favorites){
                return favorites.models.map(function (faveModel){
                    // return Track.getByID(faveModel.get('track')).then(function (track){
                    //     console.log('track is: ' + JSON.stringify(track));
                    //     return track.asTrackSnippet();
                    // });
                    return Track.getByID(faveModel.get('track')).then(function(track){
                        console.log('track is: ' + JSON.stringify(track));
                        return track.asTrackSnippet();
                    });
                });
            });

        });


    }
});

module.exports = Favorite;
