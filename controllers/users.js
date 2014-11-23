var Promise = require('bluebird');
var StatusTypes = require('status-types');

var User = require('../models/user');

var ERRORS = {
    TRACK_NOT_FOUND: {
        message: 'No track exists with the given ID'
    },
    USER_NOT_FOUND: {
        message: 'No use exists with the given ID'
    }
};

exports.getTracks = function(req, res) {
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

exports.getUserSnippet = function(req, res){
    var id = req.params.id;
    User
        .getByID(id)
        .then(function(user){
            return user.asUserSnippet();
        })
        .then(function(userSnippet) {
            res.status(200).json(userSnippet);
        })
        .catch(User.NotFoundError, function() {
            res.status(404).json({message: 'This user does not exist'});
        });
};
