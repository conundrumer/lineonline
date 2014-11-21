var request = require('supertest-as-promised');

exports.register = function (agent, user) {
    return agent
        .post('/auth/register')
        .send(user.registration());
};

exports.login = function (agent, user) {
    return agent
        .post('/auth')
        .send(user.login());
};

exports.logout = function (agent) {
    return agent
        .delete('/auth');
};
