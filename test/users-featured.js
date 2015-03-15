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

describe('Featured tracks: A user', function(done) {
    before(function(done) {
        new Promise.all([
            auth.login(agent.dolan, dolan),
            auth.login(agent.bob, bob)
        ]).then(function(){done();});
    });

    it('should be able to see the default featured track (get /users/:user_id/featured', function(done) {
        agent.bob
            .get('/users/' + bob.id + '/featured')
            .expect(StatusTypes.ok, bob.full_tracks()[1], done);
    });

    it('should be able to change the featured track (put /users/:user_id/featured/:track_id', function(done) {
        agent.bob
            .put('/users/' + bob.id + '/featured/' + track_ids.bob[0])
            .expect(StatusTypes.noContent)
            .then(function() {
                return agent.bob
                    .get('/users/' + bob.id + '/featured')
                    .expect(StatusTypes.ok, bob.full_tracks()[0]);
            })
            .then(function(){done();})
            .catch(done);
    });

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
