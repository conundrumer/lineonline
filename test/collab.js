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
            auth.login(agent.bob, bob)
        ]).then(function(){
            return agent.bob
                .put('/tracks/' + track_ids.bob[0] + '/invitations/' + dolan.id)
                .expect(StatusTypes.noContent);
        })
        .then(function(){done();});
    });

    it('should be able to accept an invitation (put: /invitations/:track_id)', function (done) {
        agent.dolan
            .put('/invitations/' + track_ids.bob[0])
            .expect(StatusTypes.noContent, done);
    });

    it('should be a collaborator of a track after accepting (get: /collaborations)', function (done) {
        agent.dolan
            .get('/collaborations')
            .expect(StatusTypes.noContent, done);
    });

    it('should be a leave a track (delete: /collaborations/:track_id)', function (done) {
        agent.dolan
            .delete('/collaborations/' + track_ids.bob[0])
            .expect(StatusTypes.noContent, done);
    });

});
