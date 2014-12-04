var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');
var io = require('socket.io-client');
var LineRiderActions = require('../linerider/actions');

var RealtimeEditorStore = Reflux.createStore({
    listenables: [Actions],
    onOpenEditorSession: function(trackID) {
        console.log("opening session for this track:", trackID)
        this.trigger(-1); // not connected
        request
            .get('/api/tracks/' + trackID + '/session')
            .end(function(err, res) {
                if (err) {
                    console.error(err);
                    return;
                }
                if (res.status == StatusTypes.ok) {
                    this.connectSession(res.body.token);
                    return;
                }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },
    connectSession: function(token) {
        var socket = io.connect('/', {
            'force new connection': true,
            query: 'token=' + token
        });
        console.log('connecting');
        socket.on('connect', function() {
            console.log('editor session connected');
            this.sync = 0;
            this.trigger(this.sync);
        }.bind(this));
        socket.on('connect_error', function(err) {
            console.error(err);
        });
        socket.on('disconnect', function() {
            console.log('disconnected');
        });
        socket.on('add', LineRiderActions.addLine);
        socket.on('remove', LineRiderActions.removeLine);
        this.socket = socket;
    },
    onEmitAddLine: function(data) {
        this.emitToServer('add', data);
    },
    onEmitRemoveLine: function(data) {
        this.emitToServer('remove', data);
    },
    emitToServer: function(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
            this.pending();
            this.socket.once('sync', this.synchronize.bind(this));
        }
    },
    pending: function() {
        this.sync++;
        this.trigger(this.sync);
    },
    synchronize: function() {
        this.sync--;
        if (this.sync === 0) {
            this.trigger(this.sync);
        }
    },
    onCloseEditorSession: function() {
        console.log("closing session");
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
});

module.exports = RealtimeEditorStore;
