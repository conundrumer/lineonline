var Promise = require('bluebird');
var StatusTypes = require(__base + 'util/status-types');
var Collaboration = require('../models/collaboration');
var Invitation = require('../models/collaboration');

exports.getCollaborations = function(req, res) {
    req.user.collaborations()
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

exports.leaveCollaboration = function(req, res) {
    Collaboration
        .forge({
            track: req.params.track_id,
            collaborator: req.user.id
        })
        .fetch()
        .then(function(collab){
            if (collab) {
                return collab.destroy();
            }
        })
        .then(function() {
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};
