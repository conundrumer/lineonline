var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var CurrentPath = Router.CurrentPath;
var Link = Router.Link;
var Reflux = require('reflux');
var _ = require('underscore');

//Actions
var Actions = require('../actions');
var ErrorActions = require('../actions-error');

//Data Stores
var FavoritesStore = require('../stores/favorites');
var FeaturedStore = require('../stores/featured');

//UI Components
var Icon = require('./Icon.jsx');
var Display = require('../linerider/Display.jsx');

// this.props.trackPreview
var Tile = React.createClass({
    mixins: [
        Reflux.listenTo(FavoritesStore, 'onDataChanged'),
        Reflux.listenTo(FeaturedStore, 'onFeaturedChanged'),
        Navigation
    ],
    onDataChanged: function(newData) {
        if (this.isMounted()) {
            this.setState({
                data: newData
            });
        }
    },
    onFeaturedChanged: function(newData) {
        if (this.isMounted() && this.props.extra === 'your-track') {
            this.setState({
                featuredData: newData
            });
        }
    },
    getInitialState: function() {
        if (this.props.extra === 'your-track') {
            return {
                data: FavoritesStore.getDefaultData(),
                featuredData: FeaturedStore.getDefaultData()
            }
        } else {
            return {
                data: FavoritesStore.getDefaultData()
            }
        }
    },
    componentWillMount: function() {
        if (this.props.userId) {
            Actions.getFavorites();
            if (this.state.featuredData) {
                Actions.getFeatured(this.props.userId);
            }
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if ((this.props.userId !== nextProps.userId)
            && nextProps.userId) {
            Actions.getFavorites();
            if (this.state.featuredData) {
                Actions.getFeatured(nextProps.userId);
            }
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
    isFeatured: function(trackId) {
        if (this.state.featuredData && this.state.featuredData.featured && this.state.featuredData.featured.track_id === trackId) {
            return true;
        } else {
            return false;
        }
    },
    doNothing: function() {
        console.log('did nothing');
    },
    handleAcceptInvitation: function(event) {
        event.preventDefault();
        Actions.acceptInvitation(this.props.trackId);
        // console.log(this.props.trackId);
        // console.log(this.props.userId);
        // console.log('JOINING INVITATION');
        // console.log(event.target);
        //
        //
    },
    handleRejectInvitation: function(event) {
        event.preventDefault();
        ErrorActions.throwError({
            message: 'Are you sure you want to reject this invitation?',
            onConfirm: function() { Actions.rejectInvitation(this.props.trackId) }.bind(this),
            onCancel: this.doNothing
        });
        // if (c) {
        //     console.log('rejecting!!!');
        //     Actions.rejectInvitation(this.props.trackId);
        // }
    },
    handleDeleteTrack: function(event) {
        event.preventDefault();
        ErrorActions.throwError({
            message: 'Are you sure you want to delete this track?',
            onConfirm: function() { Actions.deleteTrack(this.props.trackId) }.bind(this),
            onCancel: this.doNothing
        });
    },
    handleLeaveCollaboration: function(event) {
        event.preventDefault();
        ErrorActions.throwError({
            message: 'Are you sure you want to leave this collaboration?',
            onConfirm: function() { Actions.leaveCollaboration(this.props.trackId) }.bind(this),
            onCancel: this.doNothing
        });
    },
    handlePlayback: function(event) {
        console.log('PLAYBACK MODEEEE');
        this.transitionTo('/track/' + this.props.trackId);
    },
    handleInfoClick: function(event) {
        event.preventDefault();
        console.log(this.props.ownerId);
        if (this.props.ownerId) {
            this.transitionTo('/profile/' + this.props.ownerId);
        }
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
    handleMakeFeatured: function(event) {
        event.preventDefault();
        console.log('attempting to add featured...');
        Actions.makeFeatured(this.props.userId, this.props.trackId);
    },
    handleRemoveFeatured: function(event) {
        event.preventDefault();
        console.log('attempting to remove featured...');
        Actions.removeFeatured(this.props.userId, this.props.trackId);
    },
    render: function() {
        var previewIcon;
        var button;
        var links;

        var favoritesHandler = this.isInFavorites(this.props.trackId) ? this.handleRemoveFavorite : this.handleAddFavorite;
        var favoritesClassName = this.isInFavorites(this.props.trackId) ? 'favorited' : 'unfavorited';

        var featuredHandler;
        var featuredClassName;

        if (this.props.extra === 'your-track') {
            featuredHandler = this.isFeatured(this.props.trackId) ? this.handleRemoveFeatured : this.handleMakeFeatured;
            featuredClassName = this.isFeatured(this.props.trackId) ? 'featured' : 'unfeatured';
        }

        // console.log(featuredHandler);
        // console.log(featuredClassName);
        // console.log(this.state.data.featured);

        if (this.props.extra === 'your-track') {
            links =
                <div className='tile-tools'>
                    <div className='tile-tool-link' onClick={this.handleInfoClick}>
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
                    <div
                        className={'tile-tool-link ' + featuredClassName}
                        onClick={featuredHandler}
                    >
                        <Icon class='tile-tool-icon' icon='bookmark' />
                    </div>
                </div>;
        } else if (!this.props.userId) {
            links =
                <div className='tile-tools'>
                    <div className='tile-tool-link' onClick={this.handleInfoClick}>
                        <Icon class='tile-tool-icon' icon='info' />
                    </div>
                    <div className='tile-tool-link'>
                        <Icon class='tile-tool-icon' icon='link-intact' />
                    </div>
                </div>
        } else {
            links =
                <div className='tile-tools'>
                    <div className='tile-tool-link' onClick={this.handleInfoClick}>
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
        // console.log(this.props.scene);
        return (
            <div className='gallery-row section group'>
                <article className={'tile ' + this.props.col}>
                    <div className='preview'>
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
            </div>
        );
    }
});

module.exports = Tile;
