var React = require('react/addons');
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//UI Components
var Tile = require('./Tile.jsx');
var Icon = require('./Icon.jsx');

var TracksCol = React.createClass({
    render: function() {
        var tracks = this.props.tracks;
        var tiles = this.props.tracks.map(function(track) {
            var trackPreview = '../../images/sample_masthead.png'; //track.preview
            return (
                <Tile
                    key={track.id}
                    userId={this.props.userId}
                    trackId={track.track_id}
                    title={track.title}
                    ownerId={track.owner.user_id}
                    description={track.description}
                    col={this.props.col}
                    extra={this.props.extra}
                    trackPreview={trackPreview}
                    scene={track.scene}
                />
            );
        }.bind(this));
        return (
            <div className='gallery-col col span_1_of_3'>
                {this.props.headerTitle && this.props.headerIcon ?
                    <Header title={this.props.headerTitle} icon={this.props.headerIcon} />
                    : null
                }
                {tiles}
            </div>
        );
    }
});

var Header = React.createClass({
    render: function() {
        return (
            <div className='gallery-row section group'>
                <h2 className='header-col'>
                    <Icon class='header-icon' icon={this.props.icon} />
                    <span className='header-title'>
                        {this.props.title}
                    </span>
                </h2>
            </div>
        );
    }
});

module.exports = TracksCol;
