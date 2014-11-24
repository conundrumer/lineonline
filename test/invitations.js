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
            .expect(StatusTypes.ok, bob.full_tracks()[0].invitees, done);
    });

    it('should be able to uninvite someone from her own track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .expect(StatusTypes.noContent, done);
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
        agent.bob
            .put('/tracks/' + track_ids.dolan[0] + '/invitations/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    it('should not be able to uninvite a non-existent user from her own track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
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

    it('should not be able to invite herself to her own track (delete: /tracks/:track_id/invitations/:user_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.bob[0] + '/invitations/' + bob.id)
            .expect(StatusTypes.badRequest, done);
    });



    // it('should be able to get invitees for a track (get: /tracks/:track_id/invitations)', function (done) {
    //     agent.bob
    //         .get('/tracks/' + track_ids.bob[0] + '/invitations/')
    //         .expect(StatusTypes.ok, [], done);
    // });



    it('should be able to uninvite favorite tracks (get: /users/:user_id/favorites)', function (done) {
        agent.bob
            .get('/users/' + bob.id + '/favorites')
            .expect(StatusTypes.ok, bob.favorites(), done);
    });

    //bob removing dolan's track from his own favorites
    //return noContent?
    it('should be able to unfavorite a track (delete: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .delete('/users/' + bob.id + '/favorites/' + track_ids.dolan[0])
            .expect(StatusTypes.noContent, done);
    });

    //bob cannot get someone else's favorites
    it('should be not be able get someone else\'s favorite tracks (get: /users/:user_id/favorites)', function (done) {
        agent.bob
            .get('/users/' + dolan.id + '/favorites')
            .expect(StatusTypes.unauthorized, done);
    });

    //bob cannot add a track to someone else's favorites
    it('should not be able to favorite a track for someone else (put: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .put('/users/' + dolan.id + '/favorites/' + track_ids.bob[0])
            .expect(StatusTypes.unauthorized, done);
    });

    //bob cannot remove a track from someone else's favorites
    it('should not be able to unfavorite a track for someone else (delete: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .delete('/users/' + dolan.id + '/favorites/' + track_ids.bob[0])
            .expect(StatusTypes.unauthorized, done);
    });

    //bob cannot add a non-existent track to his favorites
    it('should not be able to favorite a non-existent track (put: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .put('/users/' + bob.id + '/favorites/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    //bob cannot remove a non-existent track from his favorites
    it('should not be able to unfavorite a non-existent track (put: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .delete('/users/' + bob.id + '/favorites/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    //bob cannot remove an unfavorited track from his own favorites
    // it('should not be able to unfavorite an unfavorited track (delete: /users/:user_id/favorites/:track_id)', function (done) {
    //     agent.bob
    //         .delete('/users/' + bob.id + '/favorites/' + track_ids.dolan[0])
    //         .expect(StatusTypes.notFound, done);
    // });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
