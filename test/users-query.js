var demand = require('must');
var request = require('supertest-as-promised');
var Promise = require('bluebird');
var StatusTypes = require(__base + 'util/status-types');

var users = require('./util/test-users');
var dolan = users.dolan;
var bob = users.bob;
var cow = users.cow;
var eve = users.eve;
var cat = users.cat;
var cathy = users.cathy;
var track_ids = users.track_ids;
var collection_ids = users.collection_ids;

var auth = require('./util/auth');

var url = 'http://localhost:3000/api';
var agent = {
    dolan: request.agent(url),
    bob: request.agent(url),
    cow: request.agent(url),
    eve: request.agent(url),
    cat: request.agent(url),
    cathy: request.agent(url)
};

describe('User querying: A user', function () {
    before(function(done) {
        new Promise.all([
            auth.register(agent.cat, cat),
            auth.register(agent.cathy, cathy)
        ])
        .then(function(){done();});
    });
    it('should be able to search by full username (get: /users?q=username)', function (done) {
        agent.dolan
            .get('/users?q=dolan')
            .expect(StatusTypes.ok, [dolan.user()], done);
    });
    it('should be able to search by partial username (get: /users?q=username)', function (done) {
        agent.dolan
            .get('/users?q=c')
            .expect(StatusTypes.ok, [cat.user(), cathy.user(), cow.user()], done);
    });
    it('should not get any results with no query (get: /users?q=username)', function (done) {
        agent.dolan
            .get('/users?q=x')
            .expect(StatusTypes.ok, [], done);
    });
    it('should not get any results with no params (get: /users?q=username)', function (done) {
        agent.dolan
            .get('/users')
            .expect(StatusTypes.ok, [], done);
    });
});
