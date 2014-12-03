var React = require('react/addons');

//UI Components
var Icon = require('./Icon.jsx');

var MediaIcons = React.createClass({
    render: function() {
        return (
            <div className='media-icons'>
                <Icon class='media-icon' icon='media-skip-backward' />
                <Icon class='media-icon' icon='media-play' />
                <Icon class='media-icon' icon='media-pause' />
                <Icon class='media-icon' icon='media-skip-forward' />
            </div>
        );
    }
});

module.exports = MediaIcons;
