
exports.session = function(req, res) {
    res.status(200).json({
        token: 'faketoken'
    });
};

exports.onConnection = function(socket) {
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
};
