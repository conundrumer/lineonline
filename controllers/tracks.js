var Promise = require('bluebird');
var StatusTypes = require('status-types');
var User = require('../models/user');
var Track = require('../models/track');
var Invitation = require('../models/invitation');
var Collaboration = require('../models/collaboration');

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
        .getByID(parseInt(track_id) || 0)
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
    if (req.user.id == req.track.get('owner')) {
        return next();
    }
    res.status(StatusTypes.unauthorized).json(ERRORS.NOT_AUTHORIZED);
};

exports.collabRequired = function(req, res, next) {
    if (req.user.id == req.track.get('owner')) {
        return next();
    }
    req.user.collaborations()
        .fetch()
        .then(function(collabs) {
            var isCollab = collabs.models.some(function(track) {
                return track.get('id') == req.params.track_id;
            });
            if (isCollab) {
                return next();
            }
            res.status(StatusTypes.unauthorized).json(ERRORS.NOT_AUTHORIZED);
        });
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

    var pending_invite = Invitation.forge({
            track: track_id,
            invitee: invitee_id
        });

    pending_invite
        .fetch({ require: true })
        .then(function(existing_invite){
            res.status(StatusTypes.noContent).send();
        })
        .catch(Invitation.NotFoundError, function() {
            return Collaboration
                .forge({
                    track: req.params.track_id,
                    collaborator: invitee_id
                })
                .fetch({ require: true });
        })
        .then(function(existing_collab) {
            if (!existing_collab) return;
            res.status(StatusTypes.badRequest).send();
        })
        .catch(Collaboration.NotFoundError, function() {
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

    Invitation.forge({
            track: track_id,
            invitee: invitee_id
        })
        .fetch()
        .then(function(existing_invite){
            if (existing_invite) {
                return existing_invite.destroy();
            }
        })
        .then(function() {
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};

exports.getCollaborators = function(req, res) {
    req.track.collaborators()
        .fetch()
        .then(function(collabs) {
            var userSnippets = collabs.models.map(function(collab){
                return collab.asUserSnippet();
            });
            res.status(StatusTypes.ok).json(userSnippets);
        })
        .catch(console.error);
};

exports.removeCollaborator = function(req, res) {
    Collaboration
        .forge({
            track: req.params.track_id,
            collaborator: req.params.user_id
        })
        .fetch()
        .then(function(collab){
            if (collab) {
                collab.destroy();
            }
        })
        .then(function() {
            res.status(StatusTypes.noContent).send();
        });
};
