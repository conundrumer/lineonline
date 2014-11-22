var Promise = require('bluebird');

var User = require('../models/user');
var Track = require('../models/track');

var ERRORS = {
    TRACK_NOT_FOUND: {
        message: 'No track exists with the given ID'
    },
    USER_NOT_FOUND: {
        message: 'No use exists with the given ID'
    }
};

exports.makeTrack = function(req, res) {
    var owner = req.user;
    var track = req.body;

    Track
        .create(req.body, owner.get('id'))
        .then(function (track) {
            return track
                .asFullTrack()
                .addOwnerSnippet(owner.asUserSnippet());
        })
        .then(function(fullTrack) {
            res.status(201).json(fullTrack);
        })
        .catch(console.error);
};

exports.getTrack = function(req, res) {
    var track_id = req.params.track_id;

    Track
        .getByID(track_id)
        .then(function (track) {
            return track
                .asFullTrack()
                .makeOwnerSnippet();
        })
        .then(function(fullTrack) {
            res.status(200).json(fullTrack);
        })
        .catch(Track.NotFoundError, function() {
            res.status(404).json(ERRORS.TRACK_NOT_FOUND);
        })
        .catch(console.error);
};

exports.getUserTracks = function(req, res) {
    var user_id = req.params.id;

    User
        .getByID(user_id)
        .then(function (user) {
            return user.getTrackSnippets();
        })
        .then(function (trackSnippets) {
            res.status(200).json(trackSnippets);
        })
        .catch(User.NotFoundError, function() {
            res.status(404).json(ERRORS.USER_NOT_FOUND);
        })
        .catch(console.error);
};
