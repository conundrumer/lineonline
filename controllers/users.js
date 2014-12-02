var Promise = require('bluebird');
var StatusTypes = require('status-types');

var User = require('../models/user');

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
        .getByID(user_id)
        .then(function (user) {
            req.user_model = user;
            next();
        })
        .catch(User.NotFoundError, function() {
            res.status(StatusTypes.notFound).json(ERRORS.USER_NOT_FOUND);
        })
        .catch(console.error);
};

exports.getTracks = function(req, res) {
    req.user_model
        .getTrackSnippets()
        .then(function (trackSnippets) {
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
    if (req.user.id != req.user_model.get('id')){
        res.status(StatusTypes.unauthorized).json(ERRORS.NOT_AUTHORIZED);
    }
    User.update(req.body, req.user.id)
        .then(function(userProfile) {
            res.status(StatusTypes.ok).json(userProfile);
        })
        .catch(console.error);
};
