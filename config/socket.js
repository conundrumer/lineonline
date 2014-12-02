module.exports = function (server) {
    var io = require('socket.io')(server);

    io.of('/tracks').on('connection', function(socket){
    // io.sockets.on('connection', function(socket){
        console.log('a user connected');
        // socket.join(trackroom);

        socket.on('disconnect', function() {
            console.log('user disconnected');
        });

        socket.on('add', function (data) {
            socket.broadcast.emit('add', data);
        });

        socket.on('remove', function (data) {
            socket.broadcast.emit('remove', data);
        });
    });

};
