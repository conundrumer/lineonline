// tests will only pass for an initially empty database

var demand = require('must');
var express = require('express');
var request = require('supertest-as-promised');
var Promise = require('bluebird');

var url = 'http://localhost:3000/api';

var users = require('./test_users');
var dolan = users.dolan;
var bob = users.bob;
var cow = users.cow;
var eve = users.eve;
var track_ids = users.track_ids;
var collection_ids = users.collection_ids;

var agent = {
    dolan: request.agent(url),
    bob: request.agent(url),
    cow: request.agent(url),
    eve: request.agent(url)
};

// Begin with no data

// registers dolan
describe('Basic registration, authentication, and sessions: A user', function () {
    //REGISTER
    it('should be able to register (post: /auth/register)', function (done) {
        agent.dolan
            .post('/auth/register')
            .send(dolan.registration())
            .expect(201, dolan.user(), done);
    });

    //CHECK THAT IS LOGGED IN
    it('should be logged in right after registration (get: /auth)', function (done) {
        agent.dolan
            .get('/auth')
            .send(dolan.login())
            .expect(200, dolan.user(), done);
    });

    //LOG OUT
    it('should be able to log out (delete: /auth)', function(done) {
        agent.dolan
            .delete('/auth')
            .expect(204, done);
    });

    //CHECK THAT NOT LOGGED IN
    it('should not have a session while logged out (get: /auth)', function(done) {
        agent.dolan
            .get('/auth')
            .expect(401, done);
    });

    //LOG IN
    it('should be able to log back in (post: /auth)', function(done) {
        agent.dolan
            .post('/auth')
            .send(dolan.login())
            .expect(200, dolan.user(), done);
    });

    //CHECK THAT IS LOGGED IN (AGAIN)
    it('should be logged in after logging back in (get: /auth)', function(done) {
        agent.dolan
            .get('/auth')
            .expect(200, dolan.user(), done);
    });

    // log out after testing
    after(function(done) {
        logout(agent.dolan).end(done);
    });
});

function register(agent, user) {
    return agent
        .post('/auth/register')
        .send(user.registration());
}
function login(agent, user) {
    return agent
        .post('/auth')
        .send(dolan.login());
}
function logout(agent) {
    return agent
        .delete('/auth');
}

// registers bob

// Basic user snippets (/user)
describe('Basic user snippets: A user', function () {
    before(function () {
        return register(agent.bob, bob);
    });

    it('should be able to get her own user snippet (get: /users/:id)', function (done) {
        agent.dolan
            .get('/users/' + dolan.id)
            .expect(200, dolan.user(), done);
    });

    it('should be able to get someone else\'s user snippet (get: /users/:id)', function (done) {
        agent.dolan
            .get('/users/' + bob.id)
            .expect(200, bob.user(), done);
    });
    after(function () {
        return logout(agent.bob);
    });
});

describe('Basic track making, full tracks, and track snippets: A user', function () {

    before(function(done) {
        new Promise.all([
            login(agent.dolan, dolan),
            login(agent.bob, bob)
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
            logout(agent.dolan),
            logout(agent.bob)
        ]);
    });
});

describe('Registration and authentication error cases: A user', function () {
    // define the error message the way want them to be defined pls
    var errors = {
        some_fields_empty: { message: 'Missing credentials' }, // what are credentials?
        username_already_exists: { message: 'This username has already been taken' },
        email_already_exists: { message: 'This email has already been taken' },
        invalid_username: { message: 'Unknown user void' },
        invalid_password: { message: 'Invalid password' }
    };

    var dolan_reg = dolan.registration();
    var bob_reg = bob.registration();
    var dolan_login = dolan.login();
    var bob_login = bob.login();

    it('should not be able to register with some empty fields (post: /auth/register)', function (done) {
        var reg = {
            username: '',
            email: '',
            password: ''
        };
        agent.dolan
            .post('/auth/register')
            .send(reg)
            .expect(400, errors.some_fields_empty, done);
    });

    it('should not be able to register with a username that already exists (post: /auth/register)', function (done) {
        var reg = {
            username: dolan_reg.username,
            email: bob_reg.email,
            password: bob_reg.password
        };
        agent.dolan
            .post('/auth/register')
            .send(reg)
            .expect(400, errors.username_already_exists, done);
    });

    it('should not be able to register with an email that already exists (post: /auth/register)', function (done) {
        var reg = {
            username: bob_reg.username,
            email: dolan_reg.email,
            password: bob_reg.password
        };
        agent.dolan
            .post('/auth/register')
            .send(dolan.registration())
            .expect(400, errors.email_already_exists,done);
    });

    it('should not be able to log in with a non-existent username (post: /auth/register)', function (done) {
        var login = {
            username: 'void',
            password: 'void'
        };
        agent.dolan
            .post('/auth')
            .send(login)
            .expect(401, errors.invalid_username, done);
    });

    it('should not be able to log in with the wrong password (post: /auth/register)', function (done) {
        var login = {
            username: dolan_login.username,
            password: bob_login.password
        };
        agent.dolan
            .post('/auth')
            .send(login)
            .expect(401, errors.invalid_password, done);
    });

    // can a logged-in user do any of the following: login, register?
    // can a logged-out user logout again?
});

// TODO: split tests to separate files before it gets too long

// TODO: track editing
// TODO: profile
// TODO: gallery
// TODO: subscriptions
// TODO: favorites
// TODO: collections

// TODO: invitations
// TODO: collaboration (non-realtime)
// TODO: privacy
// TODO: conversations (non-realtime)

// TODO: account settings

// TODO: edge cases?
