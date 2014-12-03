var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');
var _ = require('underscore');
var LineRiderActions = require('../linerider/actions');
var io = require('socket.io-client');

var EditorStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        var EMPTY_SCENE = {
            points: {},
            lines: {}
        };

        var DEFAULT_PREVIEW = {
            top: 0,
            left: 0,
            bottom: 360,
            right: 480
        };

        var EMPTY_TRACK = {
            scene: EMPTY_SCENE,
            title: '',
            description: '',
            collaborators: [],
            invitees: [],
            tags: [],
            preview: DEFAULT_PREVIEW
        };
        this.data = {
            track: EMPTY_TRACK
        };
        return this.data
    },
    onOpenEditorSession: function(trackID) {
        console.log("opening session for this track:", trackID)
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
        });
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
        if (this.socket) {
            this.socket.emit('add', data);
            this.socket.once('sync', function() {
                console.log('line added to server');
            });
        }
    },
    onEmitRemoveLine: function(data) {
        if (this.socket) {
            this.socket.emit('remove', data);
            this.socket.once('sync', function() {
                console.log('line removed from server');
            });
        }
    },
    onCloseEditorSession: function() {
        console.log("closing session");
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    },
    onNewTrack: function() {
        this.data = this.getDefaultData();
        this.trigger(this.data);
        LineRiderActions.newScene();
    },
    onGetFullTrack: function(trackId) {
        request
            .get('/api/tracks/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    // console.log(res.body);
                    this.data.track = res.body;
                    this.trigger(this.data);
                    LineRiderActions.loadScene(this.data.track.scene);
                    return;
                }
                // if (res.notFound) {
                //     this.data.track.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onUpdateTrack: function(updatedTrackData) {
        console.log("onUpdateTrack", updatedTrackData.track_id)
        var trackId = updatedTrackData.track_id;
        request
            .put('/api/tracks/' + trackId)
            .send(updatedTrackData)
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.track = res.body;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.track.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onCreateTrack: function(unsavedTrackData) {
        console.log("onCreateTrack")
        request
            .post('/api/tracks/')
            .send(unsavedTrackData)
            .end(function(err, res) {
                if (res.status === StatusTypes.content) {
                    console.log('OH MY GOD ACTUALLY CREATED A TRACK, THIS IS THE RESPONSE BODY: ', res.body);
                    this.data.track = res.body;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.track.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onAddInvitee: function(trackId, invitee) {
        var userId = invitee.user_id;
        request
            .put('/api/tracks/' + trackId + '/invitations/' + userId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    //added invitee
                    // this.data.track.invitees = _.union(this.data.track.invitees, [invitee]);

                    var unique = this.data.track.invitees.every(function(existingInvitee) {
                        return invitee.user_id !== existingInvitee.user_id;
                    }.bind(this));

                    if (unique) {
                        this.data.track.invitees.push(invitee);
                        this.trigger(this.data);
                        console.log('added unique individual invitee!!!');
                    }

                }
            }.bind(this))
    },

    onAddInvitees: function(trackData) {
        var invitees = trackData.invitees;
        var trackId = trackData.track_id;
        invitees.forEach(function(invitee, idx, arr) {
            var userId = invitee.user_id; //for now, invitee will be the userId
            request
                .put('/api/tracks/' + trackId + '/invitations/' + userId)
                .end(function(err, res) {
                    if (res.status === StatusTypes.noContent) {
                        //added invitee
                        console.log('added invitee!!!');
                    }
                }.bind(this))
        }.bind(this));
    },

    onGetInvitees: function(trackId) {
        request
            .get('/api/tracks/' + trackId + '/invitations/')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.track.invitees = res.body;
                    this.trigger(this.data);
                }
            }.bind(this));
    }

    // onGetInvitee: function(userId) {
    //     request
    //         .get('/api/users/' + userId)
    //         .end(function(err, res) {
    //             if (res.status === StatusTypes.ok) {

    //             }
    //         }.bind(this));
    // }
});


module.exports = EditorStore;
