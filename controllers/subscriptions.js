var Promise = require('bluebird');
var StatusTypes = require(__base + 'util/status-types');
var User = require('../models/user');
var Subscription = require('../models/subscription');

exports.addSubscription = function(req, res) {
    var subscriber_id = req.user.id;
    var subscribee_id = req.user_model.id;

    var pending_subscription = Subscription
        .forge({
            subscriber: subscriber_id,
            subscribee: subscribee_id
        });

    pending_subscription
        .fetch()
        .then(function(existing_sub) {
            if (existing_sub) {
                return res.status(StatusTypes.noContent).send();
            }
            pending_subscription.save().then(function() {
                res.status(StatusTypes.noContent).send();
            });
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
    var subscriber_id = req.user.id;
    var subscribee_id = req.user_model.id;

    Subscription
        .forge({
            subscriber: subscriber_id,
            subscribee: subscribee_id
        })
        .fetch()
        .then(function(existing_sub) {
            if (existing_sub) {
                return existing_sub.destroy();
            }
        })
        .then(function () {
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};
