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

var io = require('socket.io-client');
// var socket_url = 'http://localhost:3000/tracks';
var socket_url = 'http://localhost:3000'; // /tracks doens't work yet for some reaosn
var socket = {};

var lines = require('./util/realtime-track');

function connect (token) {
    return new Promise (function (resolve, reject) {
        var socket = io.connect(socket_url, {
            'force new connection': true,
            query: 'token=' + token
        });
        socket.on('connect', resolve);
        socket.on('error', reject);
    });
}

describe('Realtime editing: A user', function () {
    before(function(done) {
            new Promise.all([
                auth.register(agent.cow, cow), // register cow
                auth.login(agent.bob, bob), // login bob
                // auth.login(agent.eve, eve)
            ])
            .then(function() {
                return agent.cow // cow make track
                    .post('/tracks')
                    .send(cow.unsaved_tracks()[0]);
            })
            .then(function() {
                return agent.cow // cow invite bob
                    .put('/tracks/' + track_ids.cow[0] + '/invitations/' + bob.id);
            })
            .then(function() {
                return agent.bob // bob accept
                    .put('/invitations/' + track_ids.cow[0]);
            })
            .then(function(){done();});
    });

    it('should be able to get a session token for a track they own', function (done) {
        agent.cow
            .get('/tracks/' + track_ids.cow[0] + '/session')
            .end(function (err, res) {
                if (err) return done(err);
                res.body.must.have.own('token');
                cow.token = res.body.token;
                done();
            });
    });

    it('should be able to get a session token for a track they collaborate on', function (done) {
        agent.bob
            .get('/tracks/' + track_ids.cow[0] + '/session')
            .end(function (err, res) {
                if (err) return done(err);
                res.body.must.have.own('token');
                bob.token = res.body.token;
                done();
            });
    });

    it('should be able to connect to a track session', function (done) {
        socket.cow = io.connect(socket_url, {
            'force new connection': true, // only for testing
            query: 'token=' + cow.token
        });
        socket.cow.on('connect', done);
        socket.cow.on('connect_error', function(err) {
            done(err);
        }); // done accepts err
    });

    it('should be able to connect to a track session with someone else connected', function (done) {
        socket.bob = io.connect(socket_url, {
            'force new connection': true, // only for testing
            query: 'token=' + bob.token
        });
        socket.bob.on('connect', done);
        socket.bob.on('error', done); // done accepts err
    });

    // socket.once: do only once for testing. in production use socket.on
    function expectEvent(socket, event, expected) {
        return new Promise(function(resolve, reject) {
            socket.once(event, function (data) {
                if (expected){
                    data.must.eql(expected);
                }
                resolve();
            });
        });
    }

    it('should be able to draw a line, where the other user receives the line', function (done) {
        new Promise.all([
            expectEvent(socket.bob, 'add', lines.cow[0]),
            expectEvent(socket.cow, 'sync')
        ]).then(function(){done();});

        socket.cow.emit('add', lines.cow[0]);
    });

    it('should be able to get a track updated by realtime editing (get: /tracks/:track_id)', function(done) {
        //cow's id is 3
        var edited_track = cow.full_tracks()[0];
        edited_track.scene = {
            points: {
                '3_0': {id: '3_0', pos: { x: 0, y: 0 }},
                '3_1': {id: '3_1', pos: { x: 480, y: 360 }}
            },
            lines: {
                '3_0': {id: '3_0', pq: { p: '3_0', q: '3_1' }}
            }
        };
        agent.bob
            .get('/tracks/' + track_ids.cow[0])
            .expect(StatusTypes.ok, edited_track, done);
    });

    it('should be able to draw a line, while the other user draws a line', function (done) {
        new Promise.all([
            expectEvent(socket.bob, 'add', lines.cow[1]),
            expectEvent(socket.cow, 'add', lines.bob[0]),
            expectEvent(socket.bob, 'sync'),
            expectEvent(socket.cow, 'sync')
        ]).then(function(){done();});

        socket.cow.emit('add', lines.cow[1]);
        socket.bob.emit('add', lines.bob[0]);
    });


    it('should be able to remove a line, where the other user receives the update', function (done) {
        new Promise.all([
            expectEvent(socket.bob, 'remove', [lines.bob[0].line.id]),
            expectEvent(socket.cow, 'sync')
        ]).then(function(){done();});

        socket.cow.emit('remove', [lines.bob[0].line.id]);
    });

    it('should be able to remove a line, while the other user is adding a line', function (done) {
        new Promise.all([
            expectEvent(socket.cow, 'add', lines.bob[1]),
            expectEvent(socket.bob, 'remove', [lines.cow[0].line.id]),
            expectEvent(socket.cow, 'sync'),
            expectEvent(socket.bob, 'sync')
        ]).then(function(){done();});

        socket.bob.emit('add', lines.bob[1]);
        socket.cow.emit('remove', [lines.cow[0].line.id]);
    });

    it('should be able to remove a line, while the other user removes it at the same time', function (done) {
        new Promise.all([
            expectEvent(socket.cow, 'remove', [lines.cow[1].line.id]),
            expectEvent(socket.bob, 'remove', [lines.cow[1].line.id]),
            expectEvent(socket.cow, 'sync'),
            expectEvent(socket.bob, 'sync')
        ]).then(function(){done();});

        socket.bob.emit('remove', [lines.cow[1].line.id]);
        socket.cow.emit('remove', [lines.cow[1].line.id]);
    });

    it('should be able to get track updated by additions and deletions (get: /tracks/:track_id)', function(done) {
        //bob's id is 2
        var edited_track = cow.full_tracks()[0];
        edited_track.scene = {
            points: {
                '2_2': {id: '2_2', pos: { x: 40, y: 60 }},
                '2_3': {id: '2_3', pos: { x: 60, y: 40 }}
            },
            lines: {
                '2_1': {id: '2_1', pq: { p: '2_2', q: '2_3' }}
            }
        };
        agent.bob
            .get('/tracks/' + track_ids.cow[0])
            .expect(StatusTypes.ok, edited_track, done);
    });
    // TODO:
    // handle error cases like invalid add/removals

    after(function() {
        return new Promise.all([
            auth.logout(agent.dolan),
            auth.logout(agent.bob)
        ]);
    });
});
