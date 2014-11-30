var Promise = require('bluebird');
var StatusTypes = require('status-types');
var User = require('../models/user');
var Track = require('../models/track');
var Invitation = require('../models/invitation');

var ERRORS = {
    TRACK_NOT_FOUND: {
        message: 'No track exists with the given ID'
    },
    USER_NOT_FOUND: {
        message: 'No use exists with the given ID'
    }
};

exports.makeTrack = function(req, res) {
    var owner = req.user;
    var track = req.body;

    Track
        .create(req.body, owner.get('id'))
        .then(function (track) {
            return track
                .asFullTrack()
                .addOwnerSnippet(owner.asUserSnippet());
        })
        .then(function(fullTrack) {
            res.status(201).json(fullTrack);
        })
        .catch(console.error);
};

exports.deleteTrack = function(req, res){
    var track_id = req.params.track_id;
    var owner = req.user;

    Track
        .getByID(track_id)
        .then(function(trackModel){
            if (owner.get('id') != trackModel.get('owner')){
                throw new Unauthorized('You do not have permission to delete this track.');
            }
            trackModel.destroy();
            return res.status(StatusTypes.noContent).send();
        })
        .catch(Unauthorized, function(err) {
            res.status(StatusTypes.unauthorized).json(err);
        })
        .catch(Track.NotFoundError, function() {
            res.status(404).json(ERRORS.TRACK_NOT_FOUND);
        })
        .catch(console.error);
}

exports.getTrack = function(req, res) {
    var track_id = req.params.track_id;

    Track
        .getByID(track_id)
        .then(function (track) {
            return track
                .asFullTrack()
                .makeOwnerSnippet();
        })
        .then(function(fullTrack) {
            res.status(200).json(fullTrack);
        })
        .catch(Track.NotFoundError, function() {
            res.status(404).json(ERRORS.TRACK_NOT_FOUND);
        })
        .catch(console.error);
};

function Unauthorized(message) {
    this.name = 'Unauthorized';
    this.message = message || 'You are not authorized to do this.';
}
Unauthorized.prototype = new Error();
Unauthorized.prototype.constructor = Unauthorized;

exports.editTrack = function(req, res) {
    var track_id = req.params.track_id;
    var owner = req.user;
    var track = Track.get

    Track
        .getByID(track_id)
        .then(function(trackModel){
            if (owner.get('id') != trackModel.get('owner')){
                throw new Unauthorized('You do not have permission to edit this track.');
            }
            return Track.update(req.body, track_id, owner.get('id'));
        })
        .then(function (trackModel){
            return trackModel
                .asFullTrack()
                .addOwnerSnippet(owner.asUserSnippet());
        })
        .then(function(fullTrack){

            res.status(StatusTypes.ok).json(fullTrack);
        })
        .catch(Unauthorized, function(err) {
            res.status(StatusTypes.unauthorized).json(err);
        })
        .catch(Track.NotFoundError, function() {
            res.status(404).json(ERRORS.TRACK_NOT_FOUND);
        })
        .catch(console.error);

};

exports.getInvitations = function(req, res) {
    Invitation
        .where({
            track: req.params.track_id
        })
        .fetchAll()
        .then(function(invites) {
            return new Promise.all(invites.models.map(function(invite) {
                    return invite.invitee().fetch();
                }));
        })
        .then(function(users) {
            var invitees = users.map(function(user) {
                return user.asUserSnippet();
            });
            res.status(StatusTypes.ok).json(invitees);
        });
};

exports.invite = function(req, res) {
    Invitation
        .forge({
            track: req.params.track_id,
            invitee: req.params.user_id
        })
        .save()
        .then(function(){
            res.status(StatusTypes.noContent).send();
        });
};

exports.uninvite = function(req, res) {
    Invitation
        .where({
            track: req.params.track_id,
            invitee: req.params.user_id
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
