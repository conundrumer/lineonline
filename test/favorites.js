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

describe('Favorites: A user', function () {

    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob)
        ]).then(function(){done();});
    });

    //bob adding dolan's track to his favorites
    it('should be able to favorite a track (put: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .put('/users/' + bob.id + '/favorites/' + track_ids.dolan[0])
            .expect(StatusTypes.noContent, done);
    });

    //bob getting his own favorites
    it('should be able to get her favorite tracks (get: /users/:user_id/favorites)', function (done) {
        agent.bob
            .get('/users/' + bob.id + '/favorites')
            .expect(StatusTypes.ok, bob.favorites(), done);
    });

    //bob removing dolan's track from his own favorites
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

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
