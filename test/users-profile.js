var demand = require('must');
var request = require('supertest-as-promised');
var Promise = require('bluebird');
var StatusTypes = require(__base + 'util/status-types');

var users = require('./util/test-users');
var dolan = users.dolan;
var bob = users.bob;
var cow = users.cow;
var eve = users.eve;
var track_ids = users.track_ids;
var collection_ids = users.collection_ids;

var auth = require('./util/auth');

var url = 'http://localhost:3000/api';
var agent = {
    dolan: request.agent(url),
    bob: request.agent(url),
    cow: request.agent(url),
    eve: request.agent(url)
};

describe('User Profile: A user', function () {

    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob)
        ]).then(function(){done();});
    });

    it('should be able to get a user\'s profile (get: /users/:id/profile)', function (done) {
        agent.dolan
            .get('/users/' + dolan.id + '/profile')
            .expect(StatusTypes.ok, dolan.profile(), done);
    });

    it('should be able to edit her own profile (put: /profile)', function (done) {
        agent.bob
            .put('/profile')
            .send(bob.unsaved_profile())
            .expect(StatusTypes.ok, bob.profile(), done);
    });

    //errors
    it('should not be able to get a non-existent user\'s profile (get: /users/:id/profile)', function (done) {
        agent.dolan
            .get('/users/' + 0 + '/profile')
            .expect(StatusTypes.notFound, done);
    });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
