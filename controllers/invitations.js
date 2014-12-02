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

function NotInvitedError(message) {
    this.name = 'NotInvitedError';
    this.message = message || 'You were not invited!';
}
NotInvitedError.prototype = new Error();
NotInvitedError.prototype.constructor = NotInvitedError;

function AlreadyCollaborating(message) {
    this.name = 'AlreadyCollaborating';
    this.message = message || 'You are already collaborating!';
}
AlreadyCollaborating.prototype = new Error();
AlreadyCollaborating.prototype.constructor = AlreadyCollaborating;

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
                throw new AlreadyCollaborating();
            }
            return Invitation
                .forge({
                    track: req.params.track_id,
                    invitee: req.user.id
                })
                .fetch();
        })
        .then(function(invited){
            if (!invited) {
                throw new NotInvitedError();
            }
            pending_collab.save().then(function() {
                // lol poor function names
                exports.decline(req, res);
            });
        })
        .catch(AlreadyCollaborating, function() {
            res.status(StatusTypes.noContent).send();
        })
        .catch(NotInvitedError, function() {
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
