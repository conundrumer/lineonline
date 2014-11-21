var demand = require('must');
var request = require('supertest-as-promised');
var Promise = require('bluebird');
var StatusTypes = require('status-types');

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

// Basic user snippets (/user)
describe('Basic user snippets: A user', function () {
    before(function () {
        return auth.register(agent.bob, bob);
    });

    it('should be able to get her own user snippet (get: /users/:id)', function (done) {
        agent.dolan
            .get('/users/' + dolan.id)
            .expect(StatusTypes.ok, dolan.user(), done);
    });

    it('should be able to get someone else\'s user snippet (get: /users/:id)', function (done) {
        agent.dolan
            .get('/users/' + bob.id)
            .expect(StatusTypes.ok, bob.user(), done);
    });
    after(function () {
        return auth.logout(agent.bob);
    });
});
