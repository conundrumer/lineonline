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

describe('Basic registration, authentication, and sessions: A user', function () {
    //REGISTER
    it('should be able to register (post: /auth/register)', function (done) {
        agent.dolan
            .post('/auth/register')
            .send(dolan.registration())
            .expect(StatusTypes.content, dolan.user(), done);
    });

    //CHECK THAT IS LOGGED IN
    it('should be logged in right after registration (get: /auth)', function (done) {
        agent.dolan
            .get('/auth')
            .send(dolan.login())
            .expect(StatusTypes.ok, dolan.user(), done);
    });

    //LOG OUT
    it('should be able to log out (delete: /auth)', function(done) {
        agent.dolan
            .delete('/auth')
            .expect(StatusTypes.noContent, done);
    });

    //CHECK THAT NOT LOGGED IN
    it('should not have a session while logged out (get: /auth)', function(done) {
        agent.dolan
            .get('/auth')
            .expect(StatusTypes.unauthorized, done);
    });

    //LOG IN
    it('should be able to log back in (post: /auth)', function(done) {
        agent.dolan
            .post('/auth')
            .send(dolan.login())
            .expect(StatusTypes.ok, dolan.user(), done);
    });

    //CHECK THAT IS LOGGED IN (AGAIN)
    it('should be logged in after logging back in (get: /auth)', function(done) {
        agent.dolan
            .get('/auth')
            .expect(StatusTypes.ok, dolan.user(), done);
    });

    // log out after testing
    after(function(done) {
        auth.logout(agent.dolan).end(done);
    });
});
