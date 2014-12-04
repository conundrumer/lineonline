var React = require('react/addons');
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//UI Components
var TracksCol = require('./TracksCol.jsx');

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

module.exports = TracksPreview;
