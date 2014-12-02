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
        .fetch()
        .then(function(existing_collab){
            if (existing_collab) {
                return res.status(StatusTypes.noContent).send();
            }
            pending_collab.save().then(function() {
                exports.decline(req, res); // lol poor function names
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
