var React = require('react/addons');
var Reflux = require('reflux');
var Actions = require('../actions');
var request = require('superagent');
var StatusTypes = require('status-types');

var HomeStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        this.data = {
            track: null
        };
        return this.data
    },
    onGetFullTrack: function(trackId) {
        request
            .get('/api/tracks/' + trackId)
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

    onUpdateTrack: function(updatedTrackData) {
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
        request
            .post('/api/tracks/')
            .send(unsavedTrackData)
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
