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

describe('Invitations: A user', function () {

    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob)
        ]).then(function(){done();});
    });

    it('should be able to invite someone to her own track (put: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .expect(StatusTypes.noContent, done);
    });

    it('should be able to get invitees for her own track (get: /tracks/:track_id/invitations)', function (done) {
        agent.bob
            .get('/tracks/' + track_ids.bob[0] + '/invitations/')
            .expect(StatusTypes.ok, [dolan.user()], done);
    });

    it('should be able to get invitations (get: /invitations)', function (done) {
        agent.dolan
            .get('/invitations')
            .expect(StatusTypes.ok, [bob.track_snippets()[0]], done);
    });

    it('should be able to uninvite someone from her own track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .expect(StatusTypes.noContent)
            .then(function(){
                return agent.bob
                    .get('/tracks/' + track_ids.bob[0] + '/invitations/')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {
                return agent.dolan
                    .get('/invitations')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should be able to decline invitations (delete: /invitations/:track_id)', function (done) {
        agent.bob
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function(){
                return agent.dolan
                    .delete('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan
                    .get('/invitations')
                    .expect(StatusTypes.ok, []);
            })
            .then(function(){
                agent.bob
                    .get('/tracks/' + track_ids.bob[0] + '/invitations/')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should be able to invite someone multiple times with no effect (put: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function(){
                return agent.bob
                    .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id);
            })
            .then(function() {
                return agent.dolan
                    .get('/invitations')
                    .expect(StatusTypes.ok, [bob.track_snippets()[0]]);
            })
            .then(function(){
                agent.bob
                    .get('/tracks/' + track_ids.bob[0] + '/invitations/')
                    .expect(StatusTypes.ok, [dolan.user()]);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should be able to uninvite someone multiple times with no effect (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function(){
                return agent.bob
                    .delete('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan
                    .get('/invitations')
                    .expect(StatusTypes.ok, []);
            })
            .then(function(){
                agent.bob
                    .get('/tracks/' + track_ids.bob[0] + '/invitations/')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should be able to decline invitations multiple times with no effect (delete: /invitations/:track_id)', function (done) {
        agent.bob
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function(){
                return agent.dolan
                    .delete('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function(){
                return agent.dolan
                    .delete('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan
                    .get('/invitations')
                    .expect(StatusTypes.ok, []);
            })
            .then(function(){
                agent.bob
                    .get('/tracks/' + track_ids.bob[0] + '/invitations/')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should not be able to invite someone to someone else\'s track (put: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .put('/tracks/' + track_ids.dolan[0] + '/invitations/' + dolan.id)
            .expect(StatusTypes.unauthorized, done);
    });

    it('should not be able to uninvite someone from someone else\'s track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.dolan[0] + '/invitations/' + dolan.id)
            .expect(StatusTypes.unauthorized, done);
    });

    it('should not be able to invite a non-existent user to her own track (put: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.dolan
            .put('/tracks/' + track_ids.dolan[0] + '/invitations/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    it('should not be able to uninvite a non-existent user from her own track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.dolan
            .delete('/tracks/' + track_ids.dolan[0] + '/invitations/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    it('should not be able to invite someone to a non-existent track (put: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .put('/tracks/' + 0 + '/invitations/' + dolan.id)
            .expect(StatusTypes.notFound, done);
    });

    it('should not be able to uninvite someone from a non-existent track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .delete('/tracks/' + 0 + '/invitations/' + dolan.id)
            .expect(StatusTypes.notFound, done);
    });

    it('should not be able to invite herself to her own track (put: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + bob.id)
            .expect(StatusTypes.badRequest, done);
    });

    it('should not be able to uninvite herself to her own track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.bob[0] + '/invitations/' + bob.id)
            .expect(StatusTypes.badRequest, done);
    });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
