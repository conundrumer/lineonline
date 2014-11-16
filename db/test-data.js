var User = require('../models/user');

var users = [{
    username: 'delu',
    password: 'yourmother',
    email: 'delu@andrew.cmu.edu'
}, {
    username: 'foo',
    password: 'bar',
    email: 'bar@bar.bar'
}];
User.populate = users;
User.relations = [{
    name: 'subscriptions',
    from: users[0],
    to: users[1]
}];

module.exports = [User];
