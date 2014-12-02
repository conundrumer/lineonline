var editTrack = require('../controllers/edit-track');
var socketio_jwt = require('socketio-jwt');
var jwt_secret = 'omgwtfsecret';
module.exports = function (server) {
    var io = require('socket.io')(server);

    io.use(socketio_jwt.authorize({
        secret: jwt_secret,
        handshake: true
    }));

    io // not sure why can't namespace it
        // .of('/tracks')
        .on('connection', editTrack.onConnection);

};
