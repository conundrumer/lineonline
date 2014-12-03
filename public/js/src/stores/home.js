var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var HomeStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            invitations: null,
            yourTracks: null,
            collaborations: null
        };
        return this.data
    },
    onGetInvitations: function() {
        request
            .get('/api/invitations/')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.invitations = res.body;
                    console.log('got user invitations!!!!');
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.invitations.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
        // request
        //     .get('/api/users/' + userId + '/tracks')
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.invitations = res.body;
        //             // console.log('got your invitations!!!!');
        //             // console.log(res.body);
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.invitations.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
    },

    onGetYourTracks: function(userId) {
        request
            .get('/api/users/' + userId + '/tracks')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.yourTracks = res.body;
                    // console.log('got your tracks!!!!');
                    // console.log(res.body);
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.yourTrack.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onGetCollaborations: function(userId) {
        request
            .get('/api/collaborations/')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.collaborations = res.body;
                    console.log('got user collaborations!!!!');
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.collaborations.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onAcceptInvitation: function(trackId) {
        request
            .put('/api/invitations/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    var newInvitations = [];

                    for (var i = 0; i < this.data.invitations.length; i++) {
                        if (this.data.invitations[i].track_id !== trackId) {
                            newInvitations.push(this.data.invitations[i]);
                        } else {
                            this.data.collaborations.push(this.data.invitations[i]);
                        }
                    }

                    this.data.invitations = newInvitations;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.invitations.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onRejectInvitation: function(trackId) {
        request
            .del('/api/invitations/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    console.log('rejected invitation!!!');

                    var newInvitations = [];

                    for (var i = 0; i < this.data.invitations.length; i++) {
                        if (this.data.invitations[i].track_id !== trackId) {
                            newInvitations.push(this.data.invitations[i]);
                        }
                    }
                    this.data.invitations = newInvitations;

                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.invitations.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onDeleteTrack: function(trackId) {
        request
            .del('/api/tracks/' + trackId)
            .end(function(err, res) {
                var newYourTracks = [];
                if (res.status === StatusTypes.noContent) {
                    for (var i = 0; i < this.data.yourTracks.length; i++) {
                        if (this.data.yourTracks[i].track_id !== trackId) {
                            newYourTracks.push(this.data.yourTracks[i]);
                        }
                    }
                    this.data.yourTracks = newYourTracks;
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.track.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onLeaveCollaboration: function(trackId) {
        request
            .del('/api/collaborations/' + trackId)
            .end(function(err, res) {
                if (res.status === StatusTypes.noContent) {
                    var newCollaborations = [];

                    for (var i = 0; i < this.data.collaborations.length; i++) {
                        if (this.data.collaborations[i].track_id !== trackId) {
                            newCollaborations.push(this.data.collaborations[i]);
                        }
                    }

                    this.data.collaborations = newCollaborations;

                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.track.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    }
});


module.exports = HomeStore;
