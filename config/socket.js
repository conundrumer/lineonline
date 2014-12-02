var editTrack = require('../controllers/edit-track');

module.exports = function (server) {
    var io = require('socket.io')(server);

    io.of('/tracks').on('connection', editTrack.onConnection);

};
