var Promise = require('bluebird');
var StatusTypes = require('status-types');
var Favorite = require('../models/favorite');

exports.addFavorite = function(req, res) {
    var user_id = req.user.id;
    var track_id = req.track.get('id');

    Favorite
        .create(user_id, track_id)
        .then(function (fave){
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};

exports.getFavorites = function(req, res) {
    req.user
        .favorites()
        .fetch()
        .then(function(tracks) {
            return new Promise.all(tracks.models.map(function(track){
                return track.asTrackSnippet();
            }));
        }).then(function (favorites) {
            res.status(StatusTypes.ok).json(favorites);
        })
        .catch(console.error);
};

exports.removeFavorite = function(req, res){
    var user_id = req.user.id;
    var track_id = req.track.get('id');

    Favorite
        .where({
            favoriter: user_id,
            track: track_id
        })
        .fetch({ require: true })
        .then(function (faveExists){
            if (faveExists) {
                return faveExists.destroy();
            }
        })
        .then(function() {
            return res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};

