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

describe('Collaboration: A user', function () {

    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob),
            auth.login(agent.cow, cow)
        ]).then(function(){
            return agent.bob // bob invite dolan
                .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
        })
        .then(function(){done();});
    });

    it('should be able to accept an invitation (put: /invitations/:track_id)', function (done) {
        agent.dolan // dolan accept bob's invitation
            .put('/invitations/' + track_ids.bob[0])
            .expect(StatusTypes.noContent, done);
    });

    it('should be a collaborator of a track after accepting (get: /collaborations & get: /tracks/:track_id/collaborators)', function (done) {
        agent.dolan // dolan see his collabs
            .get('/collaborations')
            .expect(StatusTypes.noContent, [bob.track_snippets()[0]])
            .then(function() {
                return agent.bob // see track's collaborators
                    .get('/tracks/' + track_ids.bob[0] + '/collaborators')
                    .expect(StatusTypes.ok, [dolan.user()]);
            })
            .then(function() {
                var updatedTrack = bob.full_tracks()[0];
                updatedTrack.collaborators = [dolan.user()];
                return agent.bob // see track with collaborators
                    .get('/tracks/' + track_ids.bob[0])
                    .expect(StatusTypes.ok, updatedTrack);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should be able to leave a collab (delete: /collaborations/:track_id)', function (done) {
        agent.dolan // leave collab
            .delete('/collaborations/' + track_ids.bob[0])
            .expect(StatusTypes.noContent)
            .then(function() {
                return agent.dolan // see no collab
                    .get('/collaborations')
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.bob // see no colalbroatrs on track
                    .get('/tracks/' + track_ids.bob[0] + '/collaborators')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {
                return agent.bob // see track with no collabs
                    .get('/tracks/' + track_ids.bob[0])
                    .expect(StatusTypes.ok, bob.full_tracks()[0]);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should be able to remove a collaborator from a track she owns (delete: /tracks/:track_id/collaborators/:user_id)', function (done) {
        agent.bob // invite dolan
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function() {
                return agent.dolan // accept invitation
                    .put('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.bob // remove dolan
                    .delete('/tracks/' + track_ids.bob[0] + '/collaborators/' + dolan.id)
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan // see no collab
                    .get('/collaborations')
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.bob // see no collab on track
                    .get('/tracks/' + track_ids.bob[0] + '/collaborators')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {
                return agent.bob // track has no collab
                    .get('/tracks/' + track_ids.bob[0])
                    .expect(StatusTypes.ok, bob.full_tracks()[0]);
            })
            .then(function() {done();})
            .catch(done);
    });

    // idempotence

    it('should be able to accept an invitation multiple times with no effect (put: /invitations/:track_id)', function (done) {
        agent.bob // bob invite dolan
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function() {
                return agent.dolan // dolan accept bob's invitation
                    .put('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan // dolan accept bob's invitation again
                    .put('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan // dolan see one of his collabs
                    .get('/collaborations')
                    .expect(StatusTypes.noContent, [bob.track_snippets()[0]])
            })
            .then(function() {
                return agent.bob // see track's 1 collaborators
                    .get('/tracks/' + track_ids.bob[0] + '/collaborators')
                    .expect(StatusTypes.ok, [dolan.user()]);
            })
            .then(function() {
                var updatedTrack = bob.full_tracks()[0];
                updatedTrack.collaborators = [dolan.user()];
                return agent.bob // see track with collaborators
                    .get('/tracks/' + track_ids.bob[0])
                    .expect(StatusTypes.ok, updatedTrack);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should be able to leave a collab multiple times with no effect (delete: /collaborations/:track_id)', function (done) {
        agent.dolan // leave collab
            .delete('/collaborations/' + track_ids.bob[0])
            .expect(StatusTypes.noContent)
            .then(function() {
                return agent.dolan // leave collab AGAIN
                    .delete('/collaborations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan // see no collab
                    .get('/collaborations')
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.bob // see no colalbroatrs on track
                    .get('/tracks/' + track_ids.bob[0] + '/collaborators')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {
                return agent.bob // see track with no collabs
                    .get('/tracks/' + track_ids.bob[0])
                    .expect(StatusTypes.ok, bob.full_tracks()[0]);
            })
            .then(function() {done();})
            .catch(done);
    });


    it('should be able to remove a collaborator multiple times with no effect (delete: /tracks/:track_id/collaborators/:user_id)', function (done) {
        agent.bob // invite dolan
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function() {
                return agent.dolan // accept invitation
                    .put('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.bob // remove dolan
                    .delete('/tracks/' + track_ids.bob[0] + '/collaborators/' + dolan.id)
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.bob // remove dolan again
                    .delete('/tracks/' + track_ids.bob[0] + '/collaborators/' + dolan.id)
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.dolan // see no collab
                    .get('/collaborations')
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.bob // see no collab on track
                    .get('/tracks/' + track_ids.bob[0] + '/collaborators')
                    .expect(StatusTypes.ok, []);
            })
            .then(function() {
                return agent.bob // track has no collab
                    .get('/tracks/' + track_ids.bob[0])
                    .expect(StatusTypes.ok, bob.full_tracks()[0]);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should not be able to accept an invitation to a track she wasn\'t invited to (put: /invitations/:track_id)', function (done) {
        agent.dolan // dolan attempts to bob's other track
            .put('/invitations/' + track_ids.bob[1])
            .expect(StatusTypes.badRequest, done);
    });

    it('should not be able to remove a collaborator from a track she doesn\'t own (delete: /tracks/:track_id/collaborators/:user_id)', function (done) {
        agent.bob // invite dolan
            .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
            .then(function() {
                return agent.dolan // accept invitation
                    .put('/invitations/' + track_ids.bob[0])
                    .expect(StatusTypes.noContent);
            })
            .then(function() {
                return agent.cow // remove dolan
                    .delete('/tracks/' + track_ids.bob[0] + '/collaborators/' + dolan.id)
                    .expect(StatusTypes.unauthorized);
            })
            .then(function() {done();})
            .catch(done);
    });

    it('should not be able to accept an invitation to a non-existent track (put: /invitations/:track_id)', function(done) {
        agent.dolan // dolan attempts to bob's other track
            .put('/invitations/' + 0)
            .expect(StatusTypes.notFound, done);
    });

});
