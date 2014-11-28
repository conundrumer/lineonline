var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//UI Components
var GalleryRow = require('./GalleryRow.jsx');
var Icon = require('./Icon.jsx');

// this.props.trackPreview
var GalleryTile = React.createClass({
    handleAcceptInvitation: function(event) {
        Actions.acceptInvitation(this.props.userId, this.props.trackId);
        // console.log(this.props.trackId);
        // console.log(this.props.userId);
        // console.log('JOINING INVITATION');
        // console.log(event.target);
    },
    handleRejectInvitation: function(event) {
        var c = confirm('Are you sure you want to reject this invitation?');
        if (c) {
            console.log('rejecting!!!');
            Actions.rejectInvitation(this.props.userId, this.props.trackId);
        }
    },
    handleDeleteTrack: function(event) {
        var c = confirm('Are you sure you want to delete this track?');
        if (c) {
            console.log('deleting track');
            Actions.deleteTrack(this.props.userId, this.props.trackId);
        }
    },
    handleLeaveCollaboration: function(event) {
        var c = confirm('Are you sure you want to leave this collaboration?');
        if (c) {
            console.log('leaving collab');
            Actions.leaveCollaboration(this.props.userId, this.props.trackId);
        }
    },
    handlePlayback: function(event) {
        console.log('PLAYBACK MODEEEE');
    },
    render: function() {
        var tileBg = {
            background: '#fff url("' + this.props.trackPreview + '") no-repeat center center',
            backgroundSize: 'cover'
        };

        var previewIcon;
        var button;
        var links;

        if (this.props.extra === 'your-track' || this.props.extra === 'collaboration') {
            links =
                <div className='tile-tools'>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='link-intact' />
                    </div>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='heart' />
                    </div>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='bookmark' />
                    </div>
                </div>;
        } else {
            links =
                <div className='tile-tools'>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='link-intact' />
                    </div>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='heart' />
                    </div>
                </div>
        }



        if (this.props.extra === 'invitation') {
            previewIcon =
                <div onClick={this.handleRejectInvitation}>
                    <Icon class='x-icon' icon='circle-x' />
                </div>;
            button =
                <div className='track-extra'>
                    <button className='btn-extra' onClick={this.handleAcceptInvitation}>
                       <Icon class='extra-icon' icon='circle-check' />
                       <span className='extra-title'>
                           Join
                       </span>
                    </button>
                </div>;
        } else if (this.props.extra === 'your-track') {
            previewIcon =
                <div onClick={this.handleDeleteTrack}>
                    <Icon class='x-icon' icon='circle-x' />
                </div>;
            button =
                <div className='track-extra'>
                    <Link to={'/edit/' + this.props.trackId}>
                        <button className='btn-extra' onClick={this.handleAcceptInvitation}>
                           <Icon class='extra-icon' icon='pencil' />
                           <span className='extra-title'>
                               Edit
                           </span>
                        </button>
                    </Link>
                </div>;
        } else if (this.props.extra === 'collaboration') {
            previewIcon =
                <div onClick={this.handleLeaveCollaboration}>
                    <Icon class='x-icon' icon='circle-x' />
                </div>;
            button =
                <div className='track-extra'>
                    <Link to={'/edit/' + this.props.trackId}>
                        <button className='btn-extra'>
                           <Icon class='extra-icon' icon='pencil' />
                           <span className='extra-title'>
                               Edit
                           </span>
                        </button>
                    </Link>
                </div>;
        } else {
            previewIcon =
                <div onClick={this.handlePlayback}>
                    <Icon class='preview-icon' icon='fullscreen-enter' />
                </div>;
            button = null;
        }

        return (
            <GalleryRow>
                <article className={'tile ' + this.props.col}>
                    <div className='preview' style={tileBg}>
                        {previewIcon}
                        {links}
                    </div>
                    <div className='info'>
                        <h3>
                            {this.props.title}
                        </h3>
                        <p>
                            {this.props.description}
                        </p>
                        {button}
                    </div>
                </article>
            </GalleryRow>
        );
    }
});

module.exports = GalleryTile;
