var Track = require('../models/track');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
var bookshelf = require('../db/bookshelf.dev');

var jwt_secret = 'omgwtfsecret';
exports.session = function(req, res) {
    var sessionInfo = {
        track_id: req.params.track_id,
        user_id: req.user.id,
        isOwner: req.track.get('owner') == req.user.id
    };
    var token = jwt.sign(sessionInfo, jwt_secret/*, { expiresInMinutes: 60*5 }*/);
    res.status(200).json({
        token: token
    });
};

// subject to change
var ENTITY = {
    POINT: 0,
    LINE: 1
};

exports.onConnection = function(io, socket) {
    var data = socket.decoded_token;
    var room = toString(data.track_id);
    console.log('a user connected:', data.user_id);
    socket.join(room);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // TODO: use memory stores instead of write heavy db
    socket.on('add', function (entities) {
        socket.broadcast.to(room).emit('add', entities);
        bookshelf.transaction(function(t) {
            return Track
                .where({ id: data.track_id })
                .fetch({
                    require: true,
                    transacting: t
                })
                .then(function (track) {
                    var scene = track.get('scene');
                    entities.forEach(function (e) {
                        switch (e.type) {
                            case ENTITY.POINT:
                                scene.points[e.id] = {
                                    x: e.x,
                                    y: e.y
                                };
                                break;
                            case ENTITY.LINE:
                                scene.lines[e.id] = {
                                    p1: e.p1,
                                    p2: e.p2
                                };
                                break;
                        }
                    });
                    track.save({
                        scene: scene
                    }, {
                        patch: true,
                        transacting: t
                    });
                })
                .then(function() {
                    socket.emit('sync');
                });
        })
        .catch(console.error);
    });

    socket.on('remove', function (entities) {
        socket.broadcast.to(room).emit('remove', entities);
        bookshelf.transaction(function(t) {
            return Track
                .where({ id: data.track_id})
                .fetch({
                    require: true,
                    transacting: t
                })
                .then(function (track) {
                    var scene = _.extend(track.get('scene'),{});
                    entities.forEach(function (e) {
                        switch (e.type) {
                            case ENTITY.POINT:
                                delete scene.points[e.id];
                                break;
                            case ENTITY.LINE:
                                delete scene.lines[e.id];
                                break;
                        }
                    });
                    track.save({
                        scene: scene
                    }, {
                        patch: true,
                        transacting: t
                    });
                })
                .then(function() {
                    socket.emit('sync');
                });
        })
        .catch(console.error);
    });
};
