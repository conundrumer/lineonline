var Promise = require('bluebird');
var StatusTypes = require('status-types');
var User = require('../models/user');
var Subscription = require('../models/subscription');
var Favorite = require('../models/favorite');

function Unauthorized(message) {
    this.name = 'Unauthorized';
    this.message = message || 'You are not authorized to do this.';
}
Unauthorized.prototype = new Error();
Unauthorized.prototype.constructor = Unauthorized;

exports.addFavorite = function(req, res) {
    var user_id = req.user.id;
    var track_id = parseInt(req.params.track_id);

    Favorite
        .create(user_id, track_id)
        .then(function (fave){
            console.log(JSON.stringify(fave));
            res.status(StatusTypes.noContent).send();
        })
        .catch(console.error);
};

