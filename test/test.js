// tests will only pass for an initially empty database

var demand = require('must');
var express = require('express');
var request = require('supertest');

var url = 'http://localhost:3000/api';

var users = require('./test_users');
var track_ids = users.track_ids;
var collection_ids = users.collection_ids;

var agent = {
    dolan: request.agent(url),
    bob: request.agent(url),
    cow: request.agent(url),
    eve: request.agent(url)
};

describe('What a Single User Can Do', function () {
    var dolan = users.dolan;

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

    //GET USER DATA
    it('should be able to get her id, username and null avatar_url (get: /users/:id)', function (done) {
        agent.dolan
            .get('/users/' + dolan.id)
            .expect(200, dolan.user(), done);
    });

    //POST TRACK DATA
    it('should be able to make a track (post: /tracks)', function (done) {
        agent.dolan
            .post('/tracks')
            .send(dolan.unsaved_tracks()[0])
            .expect(201, dolan.full_tracks()[0], done);
    });

    //GET ALL TRACK SNIPPET DATA
    it('should be able to get her own track snippets (get: /users/:user_id/tracks)', function(done) {
        agent.dolan
            .get('/users/' + dolan.id + '/tracks')
            .expect(200, dolan.track_snippets(), done);
    });

    //GET ONE FULL TRACK DATA
    it('should be able to get all the data of her first track (get: /tracks/:track_id)', function(done) {
        agent.dolan
            .get('/tracks/' + track_ids.dolan[0])
            .expect(200, dolan.full_tracks()[0], done);
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

    // CAN'T REGISTER SAME NAME
    it('should not be able to register the same name (post: /auth/register)', function (done) {
        agent.dolan
            .post('/auth/register')
            .send(dolan.registration())
            .expect(400, done);
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
});

// TODO: test subscriptions, favorites, empty collection

// TODO: test for edge cases like registering w/ username that already exists, getting a user/track that doesn't exist, loginrequired, etc
