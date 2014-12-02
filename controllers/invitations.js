var Promise = require('bluebird');
var StatusTypes = require('status-types');
var Invitation = require('../models/invitation');
var Collaboration = require('../models/collaboration');

exports.getInvitations = function(req, res) {

    req.user.invitations()
        .fetch()
        .then(function(tracks) {
            return new Promise.all(tracks.models.map(function(track) {
                    return track.asTrackSnippet();
                }));
        })
        .then(function(trackSnippets) {
            res.status(StatusTypes.ok).json(trackSnippets);
        });
};

exports.accept = function(req, res) {
    var user_id = req.user.id;
    var track_id = req.track.get('id');


    var pending_collab = Collaboration.forge({
            track: track_id,
            collaborator: user_id
        });

    pending_collab
        .fetch({ require: true })
        .then(function(existing_collab){
            res.status(StatusTypes.noContent).send();
        })
        .catch(Collaboration.NotFoundError, function() {
            return Invitation
                .forge({
                    track: req.params.track_id,
                    invitee: req.user.id
                })
                .fetch({ require: true });
        })
        .then(function(invite){
            if (!invite) return;
            pending_collab.save().then(function() {
                return invite.destroy();
            })
            .then(function() {
                res.status(StatusTypes.noContent).send();
            });
        })
        .catch(Invitation.NotFoundError, function() {
            res.status(StatusTypes.badRequest).json({
                message: 'You were not invited!'
            });
        })
        .catch(console.error);
};

exports.decline = function(req, res) {
    Invitation
        .forge({
            track: req.params.track_id,
            invitee: req.user.id
        })
        .fetch()
        .then(function(invite){
            if (invite) {
                invite.destroy();
            }
        })
        .then(function() {
            res.status(StatusTypes.noContent).send();
        });
};
