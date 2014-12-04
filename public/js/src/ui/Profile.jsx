var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var ProfileStore = require('../stores/profile');

//UI Components
var Icon = require('./Icon.jsx');
var MediaIcons = require('./MediaIcons.jsx');
var TracksPreview = require('./TracksPreview.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Profile = React.createClass({
    mixins: [
        Reflux.listenTo(ProfileStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: ProfileStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        Actions.getProfile(this.props.params.profileId);
        Actions.getTrackSnippets(this.props.params.profileId);
        // Actions.getFeaturedTrack(this.props.params.profileId);
        // Actions.getCollections(this.props.params.profileId);
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.params.profileId !== nextProps.params.profileId) {
            Actions.getProfile(nextProps.params.profileId);
            Actions.getTrackSnippets(nextProps.params.profileId);
            // Actions.getFeaturedTrack(this.props.params.profileId);
            // Actions.getCollections(nextProps.params.profileId);
        }
    },
    onSubscribe: function(e) {
        e.preventDefault();
        console.log('trying to add subscription...');
        Actions.addSubscription(this.props.params.profileId);
    },
    render: function() {
        var id = this.props.params.profileId;
        // var data = this.state.data;
        console.log(this.props.currentUser);
        return (
            <div className='main-content'>
                <PanelPadded isProfile={true}>
                    <div className='section group'>
                        <div className='col span_1_of_4'>
                            { this.state.data.profile ?
                                <ProfileSidebar
                                    avatarUrl={this.state.data.profile.avatar_url}
                                    username={this.state.data.profile.username}
                                    location={this.state.data.profile.location}
                                    email={this.state.data.profile.email}
                                    about={this.state.data.profile.about}
                                    subscribeHandler={this.onSubscribe}
                                />
                                : null
                            }
                        </div>
                        <div className='col span_3_of_4'>
                            <section className='profile-main'>
                                { this.state.data.featuredTrack ?
                                    <ProfileFeaturedTrack featuredTrack={this.state.data.featuredTrack} />
                                    :
                                    <article className='profile-featured-track'>
                                        <Icon class='preview-icon' icon='fullscreen-enter' />
                                        <MediaIcons />
                                        <aside className='info'>
                                            <div>
                                                <h3>Sample Featured Track</h3>
                                                <p>
                                                    Sample description
                                                </p>
                                                <h3>Owner</h3>
                                                <p>
                                                    <Link to={'/profile/' + id}>
                                                        Sample Owner
                                                    </Link>

                                                </p>
                                                <h3>Collaborators</h3>
                                                <ul>
                                                    <li>
                                                        <Link to={'/profile/'+ id}>
                                                            Sample Collaborator
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </aside>
                                    </article>
                                }
                                { this.state.data.tracks && this.state.data.profile ?
                                    <ProfileTrackSnippets tracks={this.state.data.tracks} currentUser={this.props.currentUser} username={this.state.data.profile.username} />
                                    : null
                                }
                            </section>
                        </div>
                    </div>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

var ProfileFeaturedTrack = React.createClass({
    render: function() {
        var collaboratorListItems = this.props.featuredTrack.collaborators.map(function(collaborator) {
            return (
                <li>
                    <Link to={'/profile/'+collaborator.id}>
                        {collaborator.username}
                    </Link>
                </li>
            );
        });
        return (
            <article className='profile-featured-track'>
                <Icon class='preview-icon' icon='fullscreen-enter' />
                <MediaIcons />
                <aside className='info'>
                    <div>
                        <h3>{this.props.featuredTrack.title}</h3>
                        <p>
                            {this.props.featuredTrack.description}
                        </p>
                        <h3>Owner</h3>
                        <p>
                            <Link to={'/profile/' + this.props.featuredTrack.owner.id}>
                                {this.props.featuredTrack.owner.username}
                            </Link>

                        </p>
                        <h3>Collaborators</h3>
                        <ul>
                            {collaboratorListItems}
                        </ul>
                    </div>
                </aside>
            </article>
        );
    }
});

var ProfileTrackSnippets = React.createClass({
    render: function() {
        return (
            <section className='profile-collections'>
                <article className='track-collection'>
                    {this.props.tracks.length > 0 ?
                        <div>
                            <h3 className='collection-title'>
                                {this.props.username + '\'s tracks'}
                            </h3>
                            <TracksPreview userId={this.props.currentUser} tracks={this.props.tracks} />
                        </div>
                        : null
                    }
                </article>
            </section>
        );
    }
});

var ProfileCollections = React.createClass({
    render: function() {
        var trackCollections = this.props.collections.map(function(collection) {
            return (
                <article className='track-collection'>
                    <h3 className='collection-title'>
                        {collection.title}
                    </h3>
                    <TracksPreview tracks={collection.tracks} />
                </article>
            );
        });
        return (
            <section className='profile-collections'>
                {trackCollections}
            </section>
        );
    }
});

var ProfileSidebar = React.createClass({
    render: function() {
        return (
            <section className='profile-sidebar'>
                <div className='picture'>
                    <img src={this.props.avatarUrl} />
                </div>
                <div className='info'>
                    <ProfileContactDetail username={this.props.username} location={this.props.location} email={this.props.email} />
                    <ProfileAboutDetail about={this.props.about} />
                    <ProfileInteractDetail username={this.props.username} subscribeHandler={this.props.subscribeHandler} />
                </div>
            </section>
        );
    }
});

var ProfileContactDetail = React.createClass({
    render: function() {
        return (
            <div className='detail contact'>
                <h3>{this.props.username}</h3>
                {this.props.location && this.props.location !== '' ?
                    <p>
                        <Icon class='profile-icon' icon='map-marker' />
                        <span className='profile-title'>
                            {this.props.location}
                        </span>
                    </p>
                    : null
                }
                {this.props.email && this.props.email !== '' ?
                   <p>
                        <Icon class='profile-icon' icon='envelope-closed' />
                        <span className='profile-title'>
                            {this.props.email}
                        </span>
                    </p>
                    : null
                }
            </div>
        );
    }
});

var ProfileAboutDetail = React.createClass({
    render: function() {
        return (
            <div className='detail about'>
                {this.props.about && this.props.about !== '' ?
                    <div>
                        <h3>About</h3>
                        <p>
                            {this.props.about}
                        </p>
                    </div>
                    : null
                }
            </div>
        );
    }
});

var ProfileInteractDetail = React.createClass({
    render: function() {
        return (
            <div className='detail interact'>
                <p>
                    <Icon class='profile-icon' icon='plus' />
                    <span className='profile-title'>
                        <span className='subscribe-link' onClick={this.props.subscribeHandler}>Subscribe</span> to <span className='bold'>{this.props.username}</span>
                    </span>
                </p>
            </div>
        );
    }
});


module.exports = Profile;
