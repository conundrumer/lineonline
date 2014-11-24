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

describe('Subscriptions: A user', function () {

    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob)
        ]).then(function(){done();});
    });

    it('should be able to subscribe to another user (put: /subscriptions/:user_id)', function (done) {
        agent.bob
            .put('/subscriptions/' + bob.model.subscriptions[0])
            .expect(StatusTypes.ok, bob.subscriptions()[0], done);
    });

    it('should be able to see her subscriptions (get: /subscriptions)', function (done) {
        agent.bob
            .get('/subscriptions')
            .expect(StatusTypes.ok, bob.subscriptions(), done);
    });

    // IDEMPOTENCE
    it('should be able to subscribe more than once without any effect (put: /subscriptions/:user_id)', function (done) {
        agent.bob
            .put('/subscriptions/' + bob.model.subscriptions[0])
            .expect(StatusTypes.ok, bob.subscriptions()[0], done);
    });

    it('should not have multiple subscriptions to one user (get: /subscriptions)', function (done) {
        agent.bob
            .get('/subscriptions')
            .expect(StatusTypes.ok, bob.subscriptions(), done);
    });

    it('should be able to unsubscribe from a user (delete: /subscriptions/:user_id)', function (done) {
        agent.bob
            .delete('/subscriptions/' + bob.model.subscriptions[0])
            .expect(StatusTypes.noContent, done);
    });

    it('should see no subscriptions (get: /subscriptions)', function (done) {
        agent.bob
            .get('/subscriptions')
            .expect(StatusTypes.ok, [], done);
    });

    it('should be able to unsubscribe more than once with no effect (delete: /subscriptions/:user_id)', function (done) {
        agent.bob
            .delete('/subscriptions/' + bob.model.subscriptions[0])
            .expect(StatusTypes.noContent, done);
    });

    it('should not be able to subscribe to non-existent user (put: /subscriptions/:user_id)', function (done) {
        agent.bob
            .put('/subscriptions/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    it('should not be able to unsubscribe from a non-existent user (delete: /subscriptions/:user_id)', function (done) {
        agent.bob
            .delete('/subscriptions/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    it('should not be able to subscribe without logging in (put: /subscriptions/:user_id)', function (done) {
        agent.cow
            .put('/subscriptions/' + bob.model.subscriptions[0])
            .expect(StatusTypes.unauthorized, done);
    });

    it('should not be able to get subscriptions without logging in (get: /subscriptions)', function (done) {
        agent.cow
            .get('/subscriptions')
            .expect(StatusTypes.unauthorized, done);
    });

    it('should not be able to unsubscribe without logging in (delete: /subscriptions/:user_id)', function (done) {
        agent.cow
            .delete('/subscriptions/' + bob.model.subscriptions[0])
            .expect(StatusTypes.unauthorized, done);
    });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
