var Track = require('../models/track');
var Line2D = require('line2d');
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

function addLine(lineData, scene) {
    return Line2D.makeSceneFromJSON(scene)
        .points.add(lineData.p)
        .points.add(lineData.q)
        .lines.add(lineData.line)
        .toJSON();
}

function eraseLines(lines, scene) {
    return Line2D.makeSceneFromJSON(scene)
        .lines.erase(lines)
        .toJSON();
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
    socket.on('add', function (data) {
        socket.broadcast.to(room).emit('add', data);
        if (!mutex[room]) {
            return updateScene(addLine, socket, data);
        }
        mutexQueue[room].push(updateScene.bind(null, addLine, socket, data));
    });

    socket.on('remove', function (data) {
        socket.broadcast.to(room).emit('remove', data);
        if (!mutex[room]) {
            return updateScene(eraseLines, socket, data);
        }
        mutexQueue[room].push(updateScene.bind(null, eraseLines, socket, data));
    });
};
