var Promise = require('bluebird');

var User = require('../models/user');
var Track = require('../models/track');

// TODO: don't repeat yourself
function getUser(user_id) {
    return User.where({id: user_id}).fetch();
}
function getUserSnippetJSON(user_id) {
    return getUser(user_id)
        .then(function (model) {
            return {
                user_id: model.get('id'),
                username: model.get('username'),
                avatar_url: model.get('avatar_url')
            };
        });
}

function getFullTrackJSON(model, ownerSnippet){
    var track = {
        track_id: model.get('id'),
        scene: model.get('scene'),
        title: model.get('title'),
        description: model.get('description'),
        owner: ownerSnippet,
        preview: {
            top: model.get('preview_top'),
            left: model.get('preview_left'),
            bottom: model.get('preview_bottom'),
            right: model.get('preview_right'),
        },
        collaborators: [],
        invitees: [],
        time_created: '',
        time_modified: '',
        tags: [],
        conversation: {
            messages: []
        }
    };
    if (ownerSnippet) {
        return new Promise.resolve(track);
    }
    return getUserSnippetJSON(model.get('owner'))
        .then(function(ownerSnippet) {
            track.owner = ownerSnippet;
            return track;
        });
}

function getTrackSnippetJSON(model, ownerSnippet) {
    var trackSnippet = {
        track_id: model.get('id'),
        scene: model.get('scene'),
        title: model.get('title'),
        description: model.get('description'),
        owner: ownerSnippet,
        preview: {
            top: model.get('preview_top'),
            left: model.get('preview_left'),
            bottom: model.get('preview_bottom'),
            right: model.get('preview_right'),
        }
    };
    if (ownerSnippet) {
        return new Promise.resolve(trackSnippet);
    }
    return getUserSnippetJSON(model.get('owner'))
        .then(function(ownerSnippet) {
            track.owner = ownerSnippet;
            return track;
        });
}

exports.makeTrack = function(req, res) {
    var track = req.body;
    Track.forge({
        scene: track.scene,
        title: track.title,
        description: track.description,
        owner: req.user.get('id'),
        preview_top: track.preview.top,
        preview_left: track.preview.left,
        preview_bottom: track.preview.bottom,
        preview_right: track.preview.right
    }).save()
    .then(getFullTrackJSON)
    .then(function(track) {
        res.status(201).json(track);
    }).catch(console.error);
};

exports.getTrack = function(req, res) {
    Track.where({id: req.params.track_id}).fetch()
    .then(getFullTrackJSON)
    .then(function(track) {
        res.status(200).json(track);
    });
};

exports.getUserTracks = function(req, res) {
    var user_id = req.params.id;
    new Promise.all([
        getUserSnippetJSON(user_id),
        Track.where({owner: user_id}).fetchAll()
    ]).then(function(values) {
        var userSnippet = values[0];
        var trackModels = values[1];
        new Promise.all(trackModels.map(function(model) {
            return getTrackSnippetJSON(model, userSnippet);
        })).then(function(tracks) {
            res.status(200).json(tracks);
        });

    });
};
