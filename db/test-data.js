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

module.exports = [User, Subscriptions];
