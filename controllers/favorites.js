var Promise = require('bluebird');
var StatusTypes = require('status-types');
var User = require('../models/user');
var Track = require('../models/track');
var Subscription = require('../models/subscription');
var Favorite = require('../models/favorite');

function Unauthorized(message) {
    this.name = 'Unauthorized';
    this.message = message || 'You are not authorized to do this.';
}
Unauthorized.prototype = new Error();
Unauthorized.prototype.constructor = Unauthorized;


var ERRORS = {
    TRACK_NOT_FOUND: {
        message: 'No track exists with the given ID'
    },
    USER_NOT_FOUND: {
        message: 'No user exists with the given ID'
    },
    FAVORITE_NOT_FOUND: {
        message: 'No favorite exists with the given ID'
    },
};

exports.addFavorite = function(req, res) {
    var user_id = req.user.id;
    var track_id = parseInt(req.params.track_id);

    Track
        .getByID(track_id)
        .then(function(){
            Favorite
                .create(user_id, track_id)
                .then(function (fave){
                    console.log(JSON.stringify(fave));
                    res.status(StatusTypes.noContent).send();
                })
                .catch(console.error);
        })
        .catch(Track.NotFoundError, function() {
            res.status(404).json(ERRORS.TRACK_NOT_FOUND);
        })
        .catch(console.error);
};

exports.getSubscriptions = function(req, res) {
    req.user
        .subscriptions()
        .fetch()
        .then(function(subscribees) {
            return new Promise.all(subscribees.models.map(function(user){
                var userSnippet = user.asUserSnippet();
                return user.getTrackSnippets().then(function (tracks) {
                    return {
                        subscribee: userSnippet,
                        track_snippets: tracks
                    };
                });
            }));
        }).then(function (subscriptions) {
            res.json(subscriptions);
        })
        .catch(console.error);
};

exports.getFavorites = function(req, res) {
    req.user
        .favorites()
        .fetch() // get each track and then turn it into snippets
        .then(function(tracks) {
            return new Promise.all(tracks.models.map(function(track){
                return track.asTrackSnippet().makeOwnerSnippet();
            }));
        }).then(function (favorites) {
            res.status(StatusTypes.ok).json(favorites);
        })
        .catch(console.error);
};

exports.removeFavorite = function(req, res){
    var user_id = req.user.id;
    var track_id = req.params.track_id;

    Track
        .getByID(track_id)
        .then(function(){
        Favorite
            .where({favoriter: user_id, track: track_id})
            .fetch({require: true})
            .then(function (faveModel){
                faveModel.destroy();
                return res.status(StatusTypes.noContent).send();
            })
            .catch(Favorite.NotFoundError, function() {
                res.status(404).json(ERRORS.FAVORITE_NOT_FOUND);
            })
            .catch(console.error);
        })
        .catch(Track.NotFoundError, function() {
            res.status(404).json(ERRORS.TRACK_NOT_FOUND);
        })
        .catch(console.error);

}

