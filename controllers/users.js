var Promise = require('bluebird');
var StatusTypes = require('status-types');

var User = require('../models/user');
var Track = require('../models/track');
var Favorite = require('../models/favorite');

var ERRORS = {
    USER_NOT_FOUND: {
        message: 'No use exists with the given ID'
    },
    NOT_AUTHORIZED: {
        message: 'You are not authorized to do this.'
    }
};

exports.getByID = function(req, res, next, user_id) {
    User
        .getByID(parseInt(user_id) || 0)
        .then(function (user) {
            req.user_model = user;
            next();
        })
        .catch(User.NotFoundError, function() {
            res.status(StatusTypes.notFound).json(ERRORS.USER_NOT_FOUND);
        })
        .catch(console.error);
};

exports.noSelfReference = function(req, res, next) {
    if (req.user.id === req.user_model.get('id')) {
        return res.status(StatusTypes.badRequest).json({
            message: "you can't do that to yourself"
        });
    }
    next();
};

exports.getTracks = function(req, res) {
    req.user_model
        .getTrackSnippets()
        .then(function (trackSnippets) {
            res.status(StatusTypes.ok).json(trackSnippets);
        })
        .catch(console.error);
};

exports.getCollaborations = function(req, res) {
    req.user_model.collaborations()
        .fetch()
        .then(function(collabs) {
            return Promise.map(collabs.models, function(collab) {
                return collab.asTrackSnippet();
            });
        })
        .then(function(trackSnippets) {
            res.status(StatusTypes.ok).json(trackSnippets);
        })
        .catch(console.error);
};

exports.getUserSnippet = function(req, res){
    res.status(StatusTypes.ok).json(req.user_model.asUserSnippet());
};

exports.getProfile = function(req, res) {
    res.status(StatusTypes.ok).json(req.user_model.asUserProfile());
};

exports.editProfile = function(req, res) {
    req.user
        .update(req.body)
        .then(function(user) {
            res.status(StatusTypes.ok).json(user.asUserProfile());
        })
        .catch(console.error);
};

var MAX_RESULTS = 5;
exports.search = function(req, res) {
    if (!req.query.q) {
        return res.status(StatusTypes.ok).json([]);
    }
    User
        .query(function(qb) {
            qb
                .where('username', 'like', req.query.q + '%')
                .orderBy('username', 'asc')
                .limit(MAX_RESULTS);
        })
        .fetchAll()
        .then(function(users) {
            var results = users.models.map(function(user) {
                return user.asUserSnippet();
            });
            res.status(StatusTypes.ok).json(results);
        });
};

exports.featuredTrack = function(req, res) {
    Track
        .query(function(qb) {
            qb
                .where('owner', req.params.user_id)
                .orderBy('id', 'desc')
                .limit(1);
        })
        .fetch()
        .then(function(track) {
            return track.asFullTrack();
        })
        .then(function(results) {
            res.status(StatusTypes.ok).json(results);
        });
};
