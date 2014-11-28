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
    onGetInvitations: function(userId) {
        // request
        //     .get('/api/invitations/' + userId)
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.invitations = res.body;
        //             console.log('got user invitations!!!!');
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.invitations.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
        request
            .get('/api/users/' + userId + '/tracks')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.invitations = res.body;
                    // console.log('got your invitations!!!!');
                    // console.log(res.body);
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.invitations.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
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
        // request
        //     .get('/api/collaborations/' + userId)
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.collaborations = res.body;
        //             console.log('got user collaborations!!!!');
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.collaborations.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
        request
            .get('/api/users/' + userId + '/tracks')
            .end(function(err, res) {
                if (res.status === StatusTypes.ok) {
                    this.data.collaborations = res.body;
                    // console.log('got your collaborations!!!!');
                    // console.log(res.body);
                    this.trigger(this.data);
                    return;
                }
                // if (res.notFound) {
                //     this.data.collaborations.notFound = true
                // }
                console.log('unknown status: ', res.status);
            }.bind(this));
    },

    onAcceptInvitation: function(userId, trackId) {
        // request
        //     .put('/api/invitations/' + userId + '/tracks/'  + trackId)
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.invitations = res.body;
        //             console.log(res.body);
        //             console.log('accepted invitation!!!');
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.invitations.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
        setTimeout(function() {
            var newInvitations = [];

            for (var i = 0; i < this.data.invitations.length; i++) {
                // console.log(key);
                if (this.data.invitations[i].track_id !== trackId) {
                    newInvitations.push(this.data.invitations[i]);
                } else {
                    this.data.collaborations.push(this.data.invitations[i]);
                }
            }
            this.data.invitations = newInvitations;

            this.trigger(this.data);
        }.bind(this));
    },

    onRejectInvitation: function(userId, trackId) {
        // request
        //     .delete('/api/invitations/' + userId + '/tracks/'  + trackId)
        //     .end(function(err, res) {
        //         if (res.status === StatusTypes.ok) {
        //             this.data.invitations = res.body;
        //             console.log('rejected invitation!!!');
        //             this.trigger(this.data);
        //             return;
        //         }
        //         // if (res.notFound) {
        //         //     this.data.invitations.notFound = true
        //         // }
        //         console.log('unknown status: ', res.status);
        //     }.bind(this));
        setTimeout(function() {
            var newInvitations = [];

            for (var i = 0; i < this.data.invitations.length; i++) {
                // console.log(key);
                if (this.data.invitations[i].track_id !== trackId) {
                    newInvitations.push(this.data.invitations[i]);
                }
            }

            this.data.invitations = newInvitations;

            this.trigger(this.data);
        }.bind(this));
    },

    onDeleteTrack: function(userId, trackId) {
        setTimeout(function() {
            var newYourTracks = [];

            for (var i = 0; i < this.data.yourTracks.length; i++) {
                // console.log(key);
                if (this.data.yourTracks[i].track_id !== trackId) {
                    newYourTracks.push(this.data.yourTracks[i]);
                }
            }

            this.data.yourTracks = newYourTracks;

            this.trigger(this.data);
        }.bind(this));
    },

    onLeaveCollaboration: function(userId, trackId) {
        setTimeout(function() {
            var newCollaborations = [];

            for (var i = 0; i < this.data.collaborations.length; i++) {
                // console.log(key);
                if (this.data.collaborations[i].track_id !== trackId) {
                    newCollaborations.push(this.data.collaborations[i]);
                }
            }

            this.data.collaborations = newCollaborations;

            this.trigger(this.data);
        }.bind(this));
    }
});

var TracksPreview = React.createClass({
    render: function() {
        var tracksCols = {
            0: [],
            1: [],
            2: []
        };
        this.props.tracks.forEach(function(track, idx) {
            var colIdx = idx % 3;
            tracksCols[colIdx].push(track);
        });
        return (
            <div className='section group'>
                <TracksCol col='col-first' tracks={tracksCols[0]} extra={this.props.extra} />
                <TracksCol col='col-mid' tracks={tracksCols[1]} extra={this.props.extra} />
                <TracksCol col='col-last' tracks={tracksCols[2]} extra={this.props.extra} />
            </div>
        );
    }
});

var TracksCol = React.createClass({
    render: function() {
        var tracks = this.props.tracks;
        var galleryTiles = this.props.tracks.map(function(track) {
            return (
                <GalleryTile key={track.id} title={track.title} description={track.description} col={this.props.col} extra={this.props.extra} />
            );
        }.bind(this));
        return (
            <div className='gallery-col col span_1_of_3'>
               {galleryTiles}
            </div>
        );
    }
});



module.exports = HomeStore;
