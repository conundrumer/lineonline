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
            <div className='section group'>
                <TracksCol col='col-first' tracks={tracksCols[0]} />
                <TracksCol col='col-mid' tracks={tracksCols[1]} />
                <TracksCol col='col-last' tracks={tracksCols[2]} />
            </div>
        );
    }
});

var TracksCol = React.createClass({
    render: function() {
        var tracks = this.props.tracks;
        var galleryTiles = this.props.tracks.map(function(track) {
            return (
                <GalleryTile title={track.title} description={track.description} col={this.props.col} />
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
