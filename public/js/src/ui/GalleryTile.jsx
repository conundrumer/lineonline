var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var CurrentPath = Router.CurrentPath;
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var FavoritesStore = require('../stores/favorites');

//UI Components
var GalleryRow = require('./GalleryRow.jsx');
var Icon = require('./Icon.jsx');
var Display = require('../linerider/Display.jsx');

// this.props.trackPreview
var GalleryTile = React.createClass({
    mixins: [
        Reflux.listenTo(FavoritesStore, 'onDataChanged'),
        Navigation
    ],
    onDataChanged: function(newData) {
        if (this.isMounted()) {
            this.setState({
                data: newData
            });
        }
    },
    getInitialState: function() {
        return {
            data: FavoritesStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.userId) {
            Actions.getFavorites();
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if ((this.props.userId !== nextProps.userId)
            && nextProps.userId) {
            Actions.getFavorites();
        }
    },
    isInFavorites: function(trackId) {
        if (this.state.data.favorites) {
            for (var i = 0; i < this.state.data.favorites.length; i++) {
                if (this.state.data.favorites[i].track_id === trackId) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    },
    handleAcceptInvitation: function(event) {
        event.preventDefault();
        Actions.acceptInvitation(this.props.trackId);
        // console.log(this.props.trackId);
        // console.log(this.props.userId);
        // console.log('JOINING INVITATION');
        // console.log(event.target);
    },
    handleRejectInvitation: function(event) {
        event.preventDefault();
        var c = confirm('Are you sure you want to reject this invitation?');
        if (c) {
            console.log('rejecting!!!');
            Actions.rejectInvitation(this.props.trackId);
        }
    },
    handleDeleteTrack: function(event) {
        event.preventDefault();
        var c = confirm('Are you sure you want to delete this track?');
        if (c) {
            console.log('deleting track');
            Actions.deleteTrack(this.props.trackId);
        }
    },
    handleLeaveCollaboration: function(event) {
        event.preventDefault();
        var c = confirm('Are you sure you want to leave this collaboration?');
        if (c) {
            console.log('leaving collab');
            Actions.leaveCollaboration(this.props.trackId);
        }
    },
    handlePlayback: function(event) {
        console.log('PLAYBACK MODEEEE');
        this.transitionTo('/track/' + this.props.trackId);
    },
    handleAddFavorite: function(event) {
        event.preventDefault();
        console.log('attempting to add fav...');
        Actions.addFavorite(this.props.trackId);
        // Actions.getFavorites();
    },
    handleRemoveFavorite: function(event) {
        event.preventDefault();
        console.log('attempting to remove fav...');
        Actions.removeFavorite(this.props.trackId);
    },
    render: function() {
        var tileBg = {
            background: '#fff'
        };

        var previewIcon;
        var button;
        var links;

        var favoritesHandler = this.isInFavorites(this.props.trackId) ? this.handleRemoveFavorite : this.handleAddFavorite;
        var favoritesClassName = this.isInFavorites(this.props.trackId) ? 'favorited' : 'unfavorited';

        if (this.props.extra === 'your-track' || this.props.extra === 'collaboration') {
            links =
                <div className='tile-tools'>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='info' />
                    </div>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='link-intact' />
                    </div>
                    <div
                        className={'tile-tool-link ' + favoritesClassName}
                        onClick={favoritesHandler}
                    >
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
                        <Icon class='tile-tool-icon' icon='info' />
                    </div>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='link-intact' />
                    </div>
                    <div
                        className={'tile-tool-link ' + favoritesClassName}
                        onClick={favoritesHandler}
                    >
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
                        <button className='btn-extra'>
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
                        {
                            this.props.scene ?
                            <Display scene={this.props.scene} preview={true} />
                            : null
                        }
                        {previewIcon}
                        {links}
                    </div>
                    <div className='info'>
                        <Link to={'/track/' + this.props.trackId}>
                            <h3 className='info-track-title'>
                                {this.props.title}
                            </h3>
                        </Link>
                        <p className='info-track-description'>
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
