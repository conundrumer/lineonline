var User = require('../models/user');
var Track = require('../models/track');

function getFullTrackInfo(model){
    return {
        'id': model.get('id'),
        'owner': model.get('owner'),
        'title': model.get('title'),
        'description': model.get('description'),
        'collaborators': [],
        'invites': [],
        'tags': []
    };
}

exports.makeTrack = function(req, res) {
    Track.forge({
       title: req.body.title,
       description: req.body.description,
       owner: req.user.get('id')
    }).save().then(function(model){
        res.status(201).json(getFullTrackInfo(model));
    });
};

exports.getTrack = function(req, res) {
    Track.where({id: req.params.track_id}).fetch()
    .then (function (model) {
        if (!model) {
            res.status(404).send();
        }
        res.json(getFullTrackInfo(model));
    });
};
