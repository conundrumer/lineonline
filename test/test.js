var demand = require('must');
var express = require('express');
var url = 'http://localhost:3000/api';
var request = require('supertest');

// This is the bare minimum of what must work.
describe('The First User', function () {
    var agent = request.agent(url);
    var register_data = {
        username : 'DaSnig',
        email:'a@a.a',
        password:'a'
    };
    var login_data = {

    }
    var id = 2;
    var track_id = 1;
    var user_data = {
        "_links": {
            "self": { "href": "/users/" + id },
            "profile": { "href": "/users/" + id + "/profile" },
            "favorites": { "href": "/users/" + id + "/favorites" },
            "subscriptions": { "href": "/users/" + id + "/subscriptions" },
            "collections": { "href": "/users/" + id + "/collections"},
            "tracks": { "href": "/users/" + id + "/tracks"}
        },
        id: id,
        username: 'DaSnig',
        avatar_url: null
    };
    var send_track_data = {
        "title": "Track Title",
        "description": "This is a really cool description",
    };
    var track_data = {
        "id": track_id,
        "owner": id,
        "title": "Track Title",
        "description": "This is a really cool description",
        "collaborators": [],
        "invites": [],
        "tags": []
    };


    it('should be able to register (post: /auth/register)', function (done) {
        agent
            .post('/auth/register')
            .send(register_data)
            .expect(user_data, done);
    });

    it('should be logged in right after registration (post: /auth)', function (done) {
        agent
            .post('/auth')
            .send(login_data)
            .expect(user_data, done);
    });

    it('should be able to get her id, username and null avatar_url (get: /users/:id)', function (done) {
        agent
            .get('/users/' + id)
            .expect(user_data, done);
    });

    it('should be able to make a track (post: /tracks/)', function (done) {
        agent
            .post('/tracks/')
            .send(send_track_data)
            .expect(track_data, done);
    });

    it('should be able to get id, owner, title and description of her first track (get: /tracks/:track_id)', function(done) {
        agent
            .get('/tracks/'+track_id)
            .expect(track_data, done);
    });

    it('should be able to get id, owner, title and description on a certain track of hers (get: /users/:id/tracks/:track_id)', function(done) {
        agent
            .get('/users/' + id + '/tracks/'+track_id)
            .expect(track_data, done);
    });

    it('should be able to log out (delete: /auth)', function(done) {
        agent
            .delete('/auth')
            .expect(205,done);
    });

    it('should not have a session while logged out (get: /auth)', function(done) {
        agent
            .get('/auth')
            .expect(401, done);
    })

    it('should be able to log back in (post: /auth)', function(done) {
        agent
            .post('/auth')
            .send(login_data)
            .expect(user_data, done);
    });

    it('should be logged in after logging back in (get: /auth)', function(done) {
        agent
            .get('/auth')
            .expect(user_data, done);
    });
});