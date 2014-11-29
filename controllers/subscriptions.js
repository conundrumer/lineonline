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
        .create(subscriber_id, subscribee_id)
        .then(function () {
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};




// exports.getSubscriptions = function(req, res) {
//     var id = req.user.id;
//     var subsArray = [];

//     Subscription
//         .where({subscriber: id}).fetch({require: true})
//         .then(function (subscriptions) {
//             for (var subscription in subscriptions) {
//                 subscription.asSubscription().then(function(sub){
//                     subsArray.push(sub);
//                     console.log("a subscription: " + JSON.stringify(sub));

//                 });
//             }


//             });
//             res.status(StatusTypes.ok).json(subsArray);
//         })
//         .catch(console.error);


     // Track
     //    .getByID(track_id)
     //    .then(function (track) {
     //        return track
     //            .asFullTrack()
     //            .makeOwnerSnippet();
     //    })
     //    .then(function(fullTrack) {
     //        res.status(200).json(fullTrack);
     //    })
     //    .catch(Track.NotFoundError, function() {
     //        res.status(404).json(ERRORS.TRACK_NOT_FOUND);
     //    })
     //    .catch(console.error);
// };
