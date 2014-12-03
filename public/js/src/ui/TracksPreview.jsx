var React = require('react/addons');

//UI Components
var GalleryTile = require('./GalleryTile.jsx');

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
            <div>
                {this.props.tracks && this.props.tracks.length > 0 ?
                    <div className='section group'>
                        <TracksCol
                            col='col-first'
                            userId={this.props.userId}
                            tracks={tracksCols[0]}
                            extra={this.props.extra}
                        />
                        <TracksCol
                            col='col-mid'
                            userId={this.props.userId}
                            tracks={tracksCols[1]}
                            extra={this.props.extra}
                        />
                        <TracksCol
                            col='col-last'
                            userId={this.props.userId}
                            tracks={tracksCols[2]}
                            extra={this.props.extra}
                        />
                    </div>
                    :
                    <p className='message-panel message-panel-center message-panel-tracks'>
                        No tracks to show.
                    </p>
                }
            </div>
        );
    }
});

var TracksCol = React.createClass({
    render: function() {
        var tracks = this.props.tracks;
        var galleryTiles = this.props.tracks.map(function(track) {
            var trackPreview = '../../images/sample_masthead.png'; //track.preview
            return (
                <GalleryTile
                    key={track.id}
                    userId={this.props.userId}
                    trackId={track.track_id}
                    title={track.title}
                    description={track.description}
                    col={this.props.col}
                    extra={this.props.extra}
                    trackPreview={trackPreview}
                />
            );
        }.bind(this));
        return (
            <div className='gallery-col col span_1_of_3'>
               {galleryTiles}
            </div>
        );
    }
});

module.exports = TracksPreview;
