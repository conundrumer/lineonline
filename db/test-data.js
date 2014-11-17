var User = require('../models/user');
User.populate = [
{
    username: 'delu',
    password: 'yourmother',
    email: 'delu@andrew.cmu.edu'
}, {
    username: 'foo',
    password: 'bar',
    email: 'bar@bar.bar'
}, {
    username: 'asdf',
    password: 'asdf',
    email: 'asdf@asdf.asdf'
}
];

var Subscriptions = require('../models/subscription');
Subscriptions.populate = [
{
    subscriber: 1,
    subscribee: 2
}, {
    subscriber: 3,
    subscribee: 2
}, {
    subscriber: 2,
    subscribee: 3
}
];


var Tracks = require('../models/track');
Tracks.populate = [
{
    title: "title 1",
    description: "description 1",
    owner: 1
}, {
    title: "title 2",
    description: "description 2",
    owner: 2
}, {
    title: "title 3",
    description: "description 3",
    owner: 1
}
];

module.exports = [User, Subscriptions, Tracks];

