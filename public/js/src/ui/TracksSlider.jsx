var React = require('react/addons');

//UI Components
var TracksCol = require('./TracksCol.jsx');

var TracksSlider = React.createClass({
    render: function() {
        console.log(this.props.tracks);
        var tracks = [];
        var len = (this.props.tracks.length >= 3) ? 3 : this.props.tracks.length;
        for (var i = 0; i < len; i++) {
            tracks.push(this.props.tracks[i]);
        }

        var trackCols = tracks.map(function(track, idx, arr) {
            var col;
            if (idx === '0') {
                col = 'col-first';
            } else if (idx === '1') {
                col = 'col-second';
            } else {
                col = 'col-third';
            }
            return (
                <TracksCol
                    col={col}
                    userId={this.props.userId}
                    tracks={[track]}
                />
            );
        }.bind(this));

        //this.props.tracks
        return (
            <div className='col span_3_of_4'>
                {this.props.tracks && this.props.tracks.length > 0 ?
                    trackCols
                    : null
                }
            </div>

        );
    }
});

module.exports = TracksSlider;
