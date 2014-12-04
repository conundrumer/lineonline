var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');
var _ = require('underscore');
var LineRiderActions = require('../linerider/actions');
var LocalEditorStore = require('../stores/local-editor');

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
            scene: LocalEditorStore.getDefaultData() || EMPTY_SCENE,
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
    loadLocalTrack: function() {
        var data = this.getDefaultData();
        LineRiderActions.loadScene(data.track.scene);
        return data;
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
        var trackId = updatedTrackData.track_id;
        var metadata = _.extend(updatedTrackData, {});
        delete metadata.scene;
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
    }
});


module.exports = EditorStore;
