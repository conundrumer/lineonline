var demand = require('must');
var request = require('supertest-as-promised');
var Promise = require('bluebird');

var users = require('./util/test_users');
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

describe('Basic track making, full tracks, and track snippets: A user', function () {

    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob)
        ]).then(function(){done();});
    });

    it('should be able to make tracks that are empty (post: /tracks)', function (done) {
        agent.dolan
            .post('/tracks')
            .send(dolan.unsaved_tracks()[0])
            .expect(201, dolan.full_tracks()[0], done);
    });

    it('should be able to make tracks that are empty (again) (post: /tracks)', function (done) {
        agent.bob
            .post('/tracks')
            .send(bob.unsaved_tracks()[0])
            .expect(201, bob.full_tracks()[0], done);
    });

    it('should be able to make tracks that have content (post: /tracks)', function (done) {
        agent.bob
            .post('/tracks')
            .send(bob.unsaved_tracks()[1])
            .expect(201, bob.full_tracks()[1], done);
    });

    it('should be able to get her own track snippets 1 (get: /users/:user_id/tracks)', function(done) {
        agent.dolan
            .get('/users/' + dolan.id + '/tracks')
            .expect(200, dolan.track_snippets(), done);
    });

    // it('should be able to get her own track snippets 2 (get: /users/:user_id/tracks)', function(done) {
    //     agent.bob
    //         .get('/users/' + bob.id + '/tracks')
    //         .expect(200, bob.track_snippets(), done);
    // });

    // it('should be able to get other user\'s track snippets 1 (get: /users/:user_id/tracks)', function(done) {
    //     agent.bob
    //         .get('/users/' + dolan.id + '/tracks')
    //         .expect(200, dolan.track_snippets(), done);
    // });

    // it('should be able to get other user\'s track snippets 2 (get: /users/:user_id/tracks)', function(done) {
    //     agent.dolan
    //         .get('/users/' + bob.id + '/tracks')
    //         .expect(200, bob.track_snippets(), done);
    // });

    // it('should be able to get a full track 1 (get: /tracks/:track_id)', function(done) {
    //     agent.dolan
    //         .get('/tracks/' + track_ids.dolan[0])
    //         .expect(200, dolan.full_tracks()[0], done);
    // });

    // it('should be able to get a full track 2 (get: /tracks/:track_id)', function(done) {
    //     agent.bob
    //         .get('/tracks/' + track_ids.bob[0])
    //         .expect(200, bob.full_tracks()[0], done);
    // });

    it('should be able to get a full track 3 (get: /tracks/:track_id)', function(done) {
        agent.bob
            .get('/tracks/' + track_ids.bob[1])
            .expect(200, bob.full_tracks()[1], done);
    });

    // but dolan isn't a collaborator on either of bob's tracks
    // this will need to change once we figure out playback_tracks
    it('should be able to get someone else\'s full tracks 1 (get: /tracks/:track_id)', function(done) {
        agent.dolan
            .get('/tracks/' + track_ids.bob[0])
            .expect(200, bob.full_tracks()[0], done);
    });

    // it('should be able to get someone else\'s full tracks 2 (get: /tracks/:track_id)', function(done) {
    //     agent.dolan
    //         .get('/tracks/' + track_ids.bob[1])
    //         .expect(200, bob.full_tracks()[1], done);
    // });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
