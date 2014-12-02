var Track = require('../models/track');
var jwt = require('jsonwebtoken');

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

exports.onConnection = function(io, socket) {
    var data = socket.decoded_token;
    var room = toString(data.track_id);
    console.log('a user connected:', data.user_id);
    socket.join(room);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // TODO: use memory stores instead of write heavy db
    socket.on('add', function (data) {
        socket.broadcast.to(room).emit('add', data);
    });

    socket.on('remove', function (data) {
        socket.broadcast.to(room).emit('remove', data);
    });
};
