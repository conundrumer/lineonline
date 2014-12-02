var Promise = require('bluebird');
var StatusTypes = require('status-types');
var User = require('../models/user');
var Track = require('../models/track');
var Invitation = require('../models/invitation');

var ERRORS = {
    TRACK_NOT_FOUND: {
        message: 'No track exists with the given ID'
    },
    NOT_AUTHORIZED: {
        message: 'You are not authorized to do this.'
    }
};

exports.getByID = function(req, res, next, track_id) {
    Track
        .getByID(track_id)
        .then(function (track) {
            req.track = track;
            next();
        })
        .catch(User.NotFoundError, function() {
            res.status(StatusTypes.notFound).json(ERRORS.TRACK_NOT_FOUND);
        })
        .catch(console.error);
};

exports.ownershipRequired = function(req, res, next) {
    if (req.user.get('id') == req.track.get('owner')) {
        return next();
    }
    res.status(StatusTypes.unauthorized).json(ERRORS.NOT_AUTHORIZED);
};

exports.makeTrack = function(req, res) {
    var owner = req.user;

    Track
        .create(req.body, owner.get('id'))
        .then(function (track) {
            return track
                .asFullTrack(owner.asUserSnippet());
        })
        .then(function(fullTrack) {
            res.status(201).json(fullTrack);
        })
        .catch(console.error);
};

exports.deleteTrack = function(req, res){
    req.track
        .destroy()
        .then(function() {
            return res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};

exports.getTrack = function(req, res) {
    req.track
        .asFullTrack()
        .then(function(fullTrack) {
            res.status(200).json(fullTrack);
        })
        .catch(console.error);
};

exports.editTrack = function(req, res) {
    req.track
        .update(req.body)
        .then(function(track) {
            return track
                .asFullTrack(req.user.asUserSnippet());
        })
        .then(function(fullTrack){
            res.status(StatusTypes.ok).json(fullTrack);
        })
        .catch(console.error);
};

exports.getInvitations = function(req, res) {
    req.track.invitees()
        .fetch()
        .then(function(users) {
            var invitees = users.map(function(user) {
                return user.asUserSnippet();
            });
            res.status(StatusTypes.ok).json(invitees);
        });
};

exports.invite = function(req, res) {
    var owner_id = req.user.id;
    var invitee_id = req.user_model.get('id');
    var track_id = req.track.get('id');

    if (owner_id == invitee_id) {
        return res.status(400).json({
            message: "you can't invite yourself to your own track"
        });
    }

    var pending_invite = Invitation.forge({
            track: track_id,
            invitee: invitee_id
        });

    pending_invite
        .fetch()
        .then(function(existing_invite){
            if (existing_invite) {
                return res.status(StatusTypes.noContent).send();
            }
            pending_invite.save().then(function() {
                res.status(StatusTypes.noContent).send();
            });
        })
        .catch(console.error);
};

exports.uninvite = function(req, res) {
    var owner_id = req.user.id;
    var invitee_id = req.user_model.get('id');
    var track_id = req.track.get('id');

    if (owner_id == invitee_id) {
        return res.status(400).json({
            message: "you can't invite yourself to your own track"
        });
    }

    var pending_invite = Invitation.forge({
            track: track_id,
            invitee: invitee_id
        });

    pending_invite
        .fetch()
        .then(function(existing_invite){
            if (existing_invite) {
                existing_invite.destroy();
            }
        })
        .then(function() {
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};
