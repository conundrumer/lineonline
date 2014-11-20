var demand = require('must');
var express = require('express');
var url = 'http://localhost:3000/api';
var request = require('supertest');

// This is the bare minimum of what must work. needs a fresh database
describe('The First User', function () {
    var user_id = 1;
    var username = 'bob';
    var avatar_url = '/images/default.png';
    var password = 'mymother';
    var email = 'bob@gmail.com';
    var location = 'Pittsburgh, PA';
    var about = 'Hello this is my about me.';

    var track_id = 1;
    var track_title = 'Track Title';
    var track_description = 'This is a description of a track.';
    var time_created = '2014-11-18:00:00:00';
    var time_modified = '2014-11-20:00:00:00';
    var tag = 'track tag';

    var collection_id = 1;
    var collection_title = 'Collection Title';
    var collection_description = 'This is a description of a collection';

    var conversation_id = 1;
    var message_text = 'This is some message text.';

    var scene = {
        next_point_id: 2,
        next_line_id: 1,
        points: {
            0: {
                x: 100,
                y: 200
            },
            1: {
                x: 100,
                y: 9001
            }
        },
        lines: {
            0: {
                p1: 0,
                p2: 1
            }
        }
    };

    var user = {
        user_id: id,
        username: username,
        avatar_url: avatar_url
    };

    var message = {
        author: user,
        text: message_text,
        time_created: time_created
    };

    var conversation = {
        conversation_id: conversation_id,
        messages: [message, message],
    };
    // participants: {
    //     all: [user, user, user],
    //     active: [user, user]
    // }


    var unsaved_full_track = {
        scene: scene,
        title: track_title,
        description: track_description,
        collaborators: [user, user],
        invitees: [user, user],
        tags: [tag, tag]
    };

    var full_track = {
        track_id: track_id,
        scene: scene,
        title: track_title,
        description: track_description,
        owner: user,
        collaborators: [user, user],
        invitees: [user, user],
        time_created: time_created,
        time_modified: time_modified,
        tags: [tag, tag],
        conversation: conversation
    };

    var track_snippet = {
        track_id: track_id,
        scene: scene,
        title: track_title,
        title: track_description,
        owner: user
    };

    var unsaved_collection = {
        title: collection_title,
        description: collection_description,
        track_ids: [track_id, track_id]
    };

    var collection = {
        owner: user,
        title: collection_title,
        description: collection_description,
        track_snippets: [track_snippet, track_snippet]
    };

    var collections = [collection, collection];

    var unsaved_profile = {
        username: username,
        avatar_url: avatar_url,
        email: email,
        location: location,
        about: about
    };

    var profile = {
        user_id: user_id,
        username: username,
        avatar_url: avatar_url,
        email: email,
        location: location,
        about: about
    };

    // PUT /api/user/:current_user_id/subscriptions/:other_user_id

    var subscription = {
        subscribee: user,
        track_snippets: [track_snippet, track_snippet]
    };




    //auth registration
    var registration_data = {
        username: username,
        email: email,
        password: password
    };

    //auth login
    var login_data = {
        username: username,
        password: password
    };

    //navbar (all views)
    var user_data = user;

    //index
    var global_featured_track_data = full_track;
    var gallery_preview_data = {
        hot: [track_snippet, track_snippet],
        top: [track_snippet, track_snippet],
        new: [track_snippet, track_snippet]
    };

    //home (blank editor)
    //track is null, conversation is null
    var new_editor_track_data = unsaved_full_track;

    //editor (after clicking on existing track)
    var editor_track_data = full_track;

    //playback mode
    var playback_track_data = full_track;

    //gallery
    var gallery_data = {
        hot: [track_snippet, track_snippet, track_snippet, track_snippet],
        top: [track_snippet, track_snippet, track_snippet, track_snippet],
        new: [track_snippet, track_snippet, track_snippet, track_snippet]
    };

    //search
    var search_data = [track_snippet, track_snippet];

    //your tracks
    var invitations_data = [track_snippet, track_snippet];
    var collections_data = collections;
    var featured_track_data = full_track;
    var tracks_data = [track_snippet];

    //profile
    var profile_data = profile;
    //featured_track_data (see your tracks)
    //collections_data (see your tracks)

    //favorites
    var favorites_data = [track_snippet, track_snippet];

    //subscriptions
    var subscriptions_data = [subscription, subscription];

    //settings
    var settings_data = profile;


    var agent_bob = request.agent(url);
    var agent_alice = request.agent(url);
    var agent_eve = request.agent(url);
    var agent_dolan = request.agent(url);


    //REGISTER
    it('should be able to register (post: /auth/register)', function (done) {
        agent
            .post('/auth/register')
            .send(registration_data)
            .expect(201, user_data, done);
    });

    //CHECK THAT IS LOGGED IN
    it('should be logged in right after registration (get: /auth)', function (done) {
        agent
            .get('/auth')
            .send(login_data)
            .expect(200, user_data, done);
    });

    //GET USER DATA
    it('should be able to get her id, username and null avatar_url (get: /users/:id)', function (done) {
        agent
            .get('/users/' + user_id)
            .expect(200, user_data, done);
    });

    //POST TRACK DATA
    it('should be able to make a track (post: /tracks)', function (done) {
        agent
            .post('/tracks')
            .send(new_editor_track_data)
            .expect(201, editor_track_data, done);
    });

    //GET TRACK DATA
    it('should be able to get her own track snippets (get: /users/:user_id/tracks)', function(done) {
        agent
            .get('/users/' + user_id + '/tracks')
            .expect(200, tracks_data, done);
    });

    //GET TRACK DATA
    it('should be able to get id, owner, title and description of her first track (get: /tracks/:track_id)', function(done) {
        agent
            .get('/tracks/' + track_id)
            .expect(200, editor_track_data, done);
    });

    //LOG OUT
    it('should be able to log out (delete: /auth)', function(done) {
        agent
            .delete('/auth')
            .expect(204, done);
    });

    //CHECK THAT NOT LOGGED IN
    it('should not have a session while logged out (get: /auth)', function(done) {
        agent
            .get('/auth')
            .expect(401, done);
    });

    //LOG IN
    it('should be able to log back in (post: /auth)', function(done) {
        agent
            .post('/auth')
            .send(login_data)
            .expect(200, user_data, done);
    });

    //CHECK THAT IS LOGGED IN (AGAIN)
    it('should be logged in after logging back in (get: /auth)', function(done) {
        agent
            .get('/auth')
            .expect(200, user_data, done);
    });
});

// TODO: test for edge cases like registering w/ username that already exists, getting a user/track that doesn't exist, loginrequired, etc
