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

// i can't believe i'm doing this
// this will cause memory leaks i swear
var mutex = {};
var mutexQueue = {};

// subject to change
var ENTITY = {
    POINT: 0,
    LINE: 1
};

function addEntities(entities, scene) {
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
    return scene;
}

function removeEntities(entities, scene) {
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
    return scene;
}

function updateScene(updateFn, socket, entities) {
    var data = socket.decoded_token;
    var room = data.track_id.toString();
    mutex[room] = true;
    Track
        .where({ id: data.track_id })
        .fetch({
            require: true
        })
        .then(function (track) {
            var scene = track.get('scene');
            scene = updateFn(entities, scene);
            return track.save({
                scene: scene
            }, {
                patch: true
            });
        })
        .then(function() {
            mutex[room] = false;
            socket.emit('sync');
            var next = mutexQueue[room].shift();
            if (next) {
                next();
            }
        })
        .catch(console.error);
}

exports.onConnection = function(io, socket) {
    var data = socket.decoded_token;
    var room = data.track_id.toString();
    console.log('User', data.user_id, 'connected to track', room);
    socket.join(room);

    socket.on('disconnect', function() {
        console.log('User', data.user_id, 'disconnected from track', room);
    });

    if (!mutexQueue[room]) {
        mutexQueue[room] = [];
    }

    // TODO: use memory stores instead of write heavy db
    socket.on('add', function (entities) {
        socket.broadcast.to(room).emit('add', entities);
        if (!mutex[room]) {
            return updateScene(addEntities, socket, entities);
        }
        mutexQueue[room].push(updateScene.bind(null, addEntities, socket, entities));
    });

    socket.on('remove', function (entities) {
        socket.broadcast.to(room).emit('remove', entities);
        if (!mutex[room]) {
            return updateScene(removeEntities, socket, entities);
        }
        mutexQueue[room].push(updateScene.bind(null, removeEntities, socket, entities));
    });
};
