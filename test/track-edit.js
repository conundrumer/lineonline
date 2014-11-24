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

describe('Track updating and deleting: A user', function () {

    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob)
        ]).then(function(){done();});
    });

    it('should be able to update her own track (put: /tracks/:track_id)', function (done) {
        var unsaved_track = dolan.unsaved_tracks()[0];
        unsaved_track.title = 'new title';
        var modified_unsaved_track = unsaved_track;

        var full_track = dolan.full_tracks()[0];
        full_track.title = 'new title';
        var modified_full_track = full_track;
        agent.dolan
            .put('/tracks/' + track_ids.dolan[0])
            .send(modified_unsaved_track)
            .expect(StatusTypes.ok, modified_full_track, done);
    });

    it('should not be able to update someone else\'s track (put: /tracks/:track_id)', function (done) {
        agent.bob
            .put('/tracks/' + track_ids.dolan[0])
            .send(bob.unsaved_tracks()[0])
            .expect(StatusTypes.unauthorized, done);
    });

    it('should not be able to update non-existent track (put: /tracks/:track_id)', function (done) {
        agent.bob
            .put('/tracks/' + 0)
            .send(bob.unsaved_tracks()[0])
            .expect(StatusTypes.notFound, done);
    });

    it('should be able to delete her own track (delete: /tracks/:track_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.bob[0])
            .expect(StatusTypes.noContent, done);
    });

    it('should not be able to delete someone else\'s track (delete: /tracks/:track_id)', function (done) {
        agent.bob
            .delete('/tracks/' + track_ids.dolan[0])
            .expect(StatusTypes.unauthorized, done);
    });

    it('should not be able to delete non-existent track (delete: /tracks/:track_id)', function (done) {
        agent.bob
            .delete('/tracks/' + 0)
            .expect(StatusTypes.notFound, done);
    });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
