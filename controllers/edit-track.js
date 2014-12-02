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

exports.onConnection = function(socket) {
    var data = socket.decoded_token;
    console.log('a user connected:', data.user_id);
    socket.join(data.track_id);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('add', function (data) {
        socket.broadcast.emit('add', data);
    });

    socket.on('remove', function (data) {
        socket.broadcast.emit('remove', data);
    });
};
