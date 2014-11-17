var User = require('../models/user');

function name (u) { return u.get('username'); }

User.where({username:'foo'}).fetch().then(function(user){
    console.log(name(user));
    user.subscriptions().fetch().then(function (subscriptions) {
        console.log("Subscriptions: " + subscriptions.map(name));
    });
    user.subscribers().fetch().then(function (subscribers) {
        console.log("Subscribers: " + subscribers.map(name));
    });
});
