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
            .put('/favorites/' + track_ids.dolan[0])
            .expect(StatusTypes.noContent, done);
    });

    //bob getting his own favorites
    it('should be able to get her favorite tracks (get: /users/:user_id/favorites)', function (done) {
        agent.bob
            .get('/favorites')
            .expect(StatusTypes.ok, bob.favorites(), done);
    });

    //bob removing dolan's track from his own favorites
    it('should be able to unfavorite a track (delete: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .delete('/favorites/' + track_ids.dolan[0])
            .expect(StatusTypes.noContent, done);
    });

    //bob cannot add a non-existent track to his favorites
    it('should not be able to favorite a non-existent track (put: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .put('/favorites/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    //bob cannot remove a non-existent track from his favorites
    it('should not be able to unfavorite a non-existent track (put: /users/:user_id/favorites/:track_id)', function (done) {
        agent.bob
            .delete('favorites/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    //cow is not logged in and cannot favorite a track
    it('should not be able to favorite a track if not logged in (put: /users/:user_id/favorites/:track_id)', function (done) {
        agent.cow
            .put('/favorites/' + track_ids.dolan[0])
            .expect(StatusTypes.unauthorized, done);
    });

    //cow is not logged in and cannot get his own favorites
    it('should not be able to get her favorite tracks if not logged in (get: /users/:user_id/favorites)', function (done) {
        agent.cow
            .get('/favorites')
            .expect(StatusTypes.unauthorized, done);
    });

    //cow is not logged in and cannot unfavorite a track
    it('should not be able to unfavorite a track if not logged in (delete: /users/:user_id/favorites/:track_id)', function (done) {
        agent.cow
            .delete('/favorites/' + track_ids.dolan[0])
            .expect(StatusTypes.unauthorized, done);
    });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
