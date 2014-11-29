var Promise = require('bluebird');
var StatusTypes = require('status-types');
var User = require('../models/user');
var Subscription = require('../models/subscription');

function Unauthorized(message) {
    this.name = 'Unauthorized';
    this.message = message || 'You are not authorized to do this.';
}
Unauthorized.prototype = new Error();
Unauthorized.prototype.constructor = Unauthorized;


exports.addSubscription = function(req, res) {
    var subscribee_id = parseInt(req.params.user_id);
    var subscriber_id = req.user.id;

    Subscription
        .forge({
            subscriber: subscriber_id,
            subscribee: subscribee_id
        })
        .save()
        .then(function () {
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};

exports.getSubscriptions = function(req, res) {
    req.user
        .subscriptions()
        .fetch()
        .then(function(subscribees) {
            return new Promise.all(subscribees.models.map(function(user){
                var userSnippet = user.asUserSnippet();
                return user.getTrackSnippets().then(function (tracks) {
                    return {
                        subscribee: userSnippet,
                        track_snippets: tracks
                    };
                });
            }));
        }).then(function (subscriptions) {
            res.json(subscriptions);
        })
        .catch(console.error);
};

exports.deleteSubscription = function (req, res) {

};
