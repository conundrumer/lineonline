var demand = require('must');
var request = require('supertest-as-promised');
var Promise = require('bluebird');
var StatusTypes = require('status-types');

var users = require('./util/test-users');
var dolan = users.dolan;
var bob = users.bob;
var cow = users.cow;
var eve = users.eve;
var cat = users.cat;
var cathy = users.cathy;
var track_ids = users.track_ids;
var collection_ids = users.collection_ids;

var auth = require('./util/auth');

var url = 'http://localhost:3000/api';
var agent = {
    dolan: request.agent(url),
    bob: request.agent(url),
    cow: request.agent(url),
    eve: request.agent(url),
    cat: request.agent(url),
    cathy: request.agent(url)
};

describe('changing user settings (email and password)', function() {
    before(function() {
        return auth.login(agent.cathy, cathy);
    });

    it('should be able to change email', function(done) {
        agent.cathy
            .put('/settings')
            .send({
                email: 'cathy@bat.com',
                password: 'hat',
                confirm_password: 'hat'
            })
            .expect(StatusTypes.noContent)
            .then(function() {
                var changedProfile = cathy.profile();
                changedProfile.email = 'cathy@bat.com';
                return agent.cathy
                    .get('/users/' + cathy.id + '/profile')
                    .expect(StatusTypes.ok, changedProfile, done);
            })
            .catch(done);
    });

    it('should be able to change password', function(done) {
        agent.cathy
            .put('/settings')
            .send({
                new_password: 'bat',
                password: 'hat',
                confirm_password: 'hat'
            })
            .expect(StatusTypes.noContent)
            .then(function() {
                return auth.logout(agent.cathy);
            })
            .then(function() {
                return agent.cathy
                    .get('/auth')
                    .send({
                        username: 'cathy',
                        password: 'bat'
                    })
                    .expect(StatusTypes.ok, cathy.user(), done);
            })
            .then(function(){done();})
            .catch(done);
    });
});
