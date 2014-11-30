var Promise = require('bluebird');
var StatusTypes = require('status-types');
var Invitation = require('../models/invitation');

exports.getInvitations = function(req, res) {
    var user_id = req.user.id;
    Invitation
        .where({
            invitee: user_id
        })
        .fetchAll()
        .then(function(invites) {
            return new Promise.all(invites.models.map(function(invite) {
                    return invite.track().fetch();
                }));
        })
        .then(function(tracks) {
            return new Promise.all(tracks.map(function(track) {
                    return track.asTrackSnippet().makeOwnerSnippet();
                }));
        })
        .then(function(trackSnippets) {
            res.status(StatusTypes.ok).json(trackSnippets);
        });
};

exports.accept = function(req, res) {
    res.status(501).send();
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
