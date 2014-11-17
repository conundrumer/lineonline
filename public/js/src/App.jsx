var React = require('react/addons');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

// var names = ['delu', 'jing', 'what'];

//data={this.props.data.index} currentUser={this.props.data.currentUser}


//Sample Users
var SampleUser1 = {
    id: 1,
    username: 'delu',
    avatar_url: '/images/delu.jpg'
};
var SampleUser2 = {
    id: 2,
    username: 'snigdhar',
    avatar_url: '/images/snigdhar.jpg'
};
var SampleUser3 = {
    id: 3,
    username: 'jingxiao',
    avatar_url: '/images/sample_profile.png'
};

//Sample Tracks
var SampleTrack1 = {
    title: 'Sample Track 1',
    description: 'Description of sample track 1.',
    owner: SampleUser1,
    collaborators: [
        SampleUser2,
        SampleUser3
    ],
    blob: 'Blob string of featured track',
    thumbUrl: '/images/sample_masthead.png'
};
var SampleTrack2 = {
    title: 'Sample Track 2',
    description: 'Description of sample track 2.',
    owner: SampleUser2,
    collaborators: [
        SampleUser1
    ],
    blob: 'Blob string of sample track 2',
    thumbUrl: '/images/sample_masthead.png'
};
var SampleTrack3 = {
    title: 'Sample Track 3',
    description: 'Description of sample track 3.',
    owner: SampleUser3,
    collaborators: [
        SampleUser1,
        SampleUser2
    ],
    blob: 'Blob string of sample track 3',
    thumbUrl: '/images/sample_masthead.png'
};
var SampleTrack4 = {
    title: 'Sample Track 4',
    description: 'Description of sample track 4.',
    owner: SampleUser1,
    collaborators: [
        SampleUser3
    ],
    blob: 'Blob string of sample track 4',
    thumbUrl: '/images/sample_masthead.png'
};


//Sample Collections
var SampleCollection1 = {
    title: 'Sample Collection Title 1',
    description: 'Description of Sample Collection 1',
    tracks: [
        SampleTrack1,
        SampleTrack3,
        SampleTrack2,
        SampleTrack4
    ]
}
var SampleCollection2 = {
    title: 'Sample Collection Title 2',
    description: 'Description of Sample Collection 2',
    tracks: [
        SampleTrack2,
        SampleTrack4
    ]
}


var Data = {
    currentUser: SampleUser1,
    indexData: {

    },
    profileData: {
        users: {
            1: {
                id: SampleUser1.id,
                username: SampleUser1.username,
                avatar_url: SampleUser1.avatar_url,

                info: {
                    email: 'delu@andrew.cmu.edu',
                    location: 'Pittsburgh, PA',
                    description: 'Blah blah blah.',
                },

                featured_track: SampleTrack3,
                collections: [
                    SampleCollection1,
                    SampleCollection2
                ]
            },

            2: {
                id: SampleUser2.id,
                username: SampleUser2.username,
                avatar_url: SampleUser2.avatar_url,

                info: {
                    email: 'snigdhar@andrew.cmu.edu',
                    location: 'Pittsburgh, PA',
                    description: 'Blah blah blah.',
                },

                featured_track: SampleTrack4,
                collections: [
                    SampleCollection1,
                    SampleCollection2
                ]
            },

            3: {
                id: SampleUser3.id,
                username: SampleUser3.username,
                avatar_url: SampleUser3.avatar_url,

                info: {
                    email: 'jingxiao@andrew.cmu.edu',
                    location: 'Pittsburgh, PA',
                    description: 'Blah blah blah.',
                },

                featured_track: SampleTrack2,
                collections: [
                    SampleCollection1,
                    SampleCollection2
                ]
            }
        }
    },
    subscriptionsData: {
        users: {
            1: {
                subscriptions: [
                    SampleUser2,
                    SampleUser3
                ]
            },
            2: {
                subscriptions: [
                    SampleUser3,
                    SampleUser1
                ]
            },
            3: {
                subscriptions: [
                    SampleUser1,
                    SampleUser2
                ]
            }
        }
    }
};

var App = React.createClass({
    render: function() {
        // return (
        //     <div className='login-link'>
        //         {names.map(function(n) {
        //             return <Hello name={n} />
        //         })}
        //     </div>
        // );
        // var { currentUser, index, profile, subscriptions, ...other } = Data;
        return (
            <div className='container'>
                <Navbar currentUser={Data.currentUser} />
                <this.props.activeRouteHandler data={Data} />
            </div>
        );
    }
});

var NotFound = React

var Index = React.createClass({
    // var { currentUser, index, ...other } = this.props.data;
    render: function() {
        return (
            <div className='main-content'>
                <Panel isMasthead={true} id='masthead-panel' />
                <ScrollDivider link='#editor-panel' />
                <Panel isEditor={true} id='editor-panel' />
                <ScrollDivider link='#gallery-panel' />
                <PanelPadded isGallery={true} id='gallery-panel'>
                    <GalleryPreview />
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

var Home = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Panel isEditor={true}>
                    <Conversation />
                </Panel>
                <Footer />
            </div>
        );
    }
});


var Conversation = React.createClass({
    render: function() {
        return (
            <section className='side-panel side-panel-conversation minimized'>
                <Icon class='conversation-icon' icon='chevron-left' />
                <h2>
                    Conversation
                </h2>
                <article className='messages'>
                    <Message messageBody='1 Hello this is the first a simple message.' />
                    <Message messageBody='2 Hello this is another simple message.' />
                    <Message messageBody='3 Hello this is yet anooother simple message.' />
                    <Message messageBody='4 Hello this is yet anooother simple message.' />
                    <Message messageBody='5 Hello this is yet anooother simple message.' />
                    <Message messageBody='6 Hello this is yet anooother simple message.' />
                    <Message messageBody='7 Hello this is yet anooother simple message.' />
                    <Message messageBody='8 Hello this is yet anooother simple message.' />
                    <Message messageBody='9 Hello this is the last yet anooother simple message.' />
                    <Message messageBody='10 Hello this is the last yet anooother simple message.' />
                </article>
                <form className='form-message' method='post' action='/send-message'>
                    <input name='message-text' type='text' placeholder='Type message...' />
                    <button className='btn-submit' type='submit'>
                        Send
                    </button>
                </form>
            </section>
        );
    }
});

var Message = React.createClass({
    render: function() {
        return (
            <div className='message'>
                <div className='message-image' />
                <div className='message-body'>
                    <p>
                        {this.props.messageBody}
                    </p>
                </div>
            </div>
        );
    }
});

//{this.props.data.gallery}
//{this.props.data.currentUser}
var Gallery = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <PanelPadded isGallery={true}>
                    <SearchBar />
                    <div className='section group'>
                        <GalleryPreview />
                    </div>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

var SearchBar = React.createClass({
    render: function() {
        return (
            <div className='section group'>
                <form className='form-search-gallery' method='get' action='/search-gallery'>
                    <div className='section group'>
                        <div className='col span_10_of_12 search-bar'>
                            <input className='input-search' name='search-keyword' type='text' placeholder='Search for tracks...' />
                            <Icon class='search-icon' icon='magnifying-glass' />
                        </div>
                        <div className='col span_2_of_12'>
                            <button className='btn-search' type='submit'>
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});


//{this.props.data.yourTracks}
//{this.props.data.currentUser}
var YourTracks = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Panel isYourTracks={true}>
                    <div className='panel-padded'>
                        <div className='section group'>
                            <TracksPreview />
                        </div>
                    </div>
                </Panel>
                <Footer />
            </div>
        );
    }
});

//{this.props.data.profile}
//{this.props.data.currentUser}
var Profile = React.createClass({
    render: function() {
        // var currentUser = this.props.data.currentUser;
        var id = this.props.params.profileId;
        var profileData = this.props.data.profileData.users[id];
        console.log(profileData);
        return (
            <div className='main-content'>
                <PanelPadded isProfile={true}>
                    <div className='section group'>
                        <div className='col span_1_of_4'>
                            <ProfileSidebar avatarUrl={profileData.avatar_url} username={profileData.username} location={profileData.info.location} email={profileData.info.email} description={profileData.info.description} />
                        </div>
                        <div className='col span_3_of_4'>
                            <ProfileMain username={profileData.username} featuredTrack={profileData.featured_track} collections={profileData.collections} />
                        </div>
                    </div>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

var ProfileMain = React.createClass({
    render: function() {
        return (
            <section className='profile-main'>
                <ProfileFeaturedTrack featuredTrack={this.props.featuredTrack} />
                <ProfileCollections collections={this.props.collections} />
            </section>
        );
    }
});

var ProfileFeaturedTrack = React.createClass({
    render: function() {
        var featuredTrack = this.props.featuredTrack;
        var collaboratorListItems = featuredTrack.collaborators.map(function(collaborator) {
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
                    <h3>{featuredTrack.title}</h3>
                    <p>
                        {featuredTrack.description}
                    </p>
                    <h3>Owner</h3>
                    <p>
                        <Link to={'/profile/'+featuredTrack.owner.id}>
                            {featuredTrack.owner.username}
                        </Link>

                    </p>
                    <h3>Collaborators</h3>
                    <ul>
                        {collaboratorListItems}
                    </ul>
                </aside>
            </article>
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
                    <CollectionsPreview collectionTracks={collection.tracks} />
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

var ProfileSidebar = React.createClass({
    render: function() {
        return (
            <section className='profile-sidebar'>
                <div className='picture'>
                    <img src={this.props.avatarUrl} />
                </div>
                <div className='info'>
                    <ProfileContactDetail username={this.props.username} location={this.props.location} email={this.props.email} />
                    <ProfileAboutDetail description={this.props.description} />
                    <ProfileInteractDetail username={this.props.username} />
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
                <p>
                    <Icon class='profile-icon' icon='map-marker' />
                    <span className='profile-title'>
                        {this.props.location}
                    </span>
                </p>
                <p>
                    <Icon class='profile-icon' icon='envelope-closed' />
                    <span className='profile-title'>
                        {this.props.email}
                    </span>
                </p>
            </div>
        );
    }
});

var ProfileAboutDetail = React.createClass({
    render: function() {
        return (
            <div className='detail about'>
                <h3>About</h3>
                <p>
                    {this.props.description}
                </p>
            </div>
        );
    }
});

var ProfileInteractDetail = React.createClass({
    render: function() {
        return (
            <div className='detail interact'>
                <p>
                    <Link to='subscribe'>
                        <Icon class='profile-icon' icon='plus' />
                        <span className='profile-title'>
                            <span className='subscribe-link'>Subscribe</span> to <span className='bold'>{this.props.username}</span>
                        </span>
                    </Link>
                </p>
            </div>
        );
    }
});



var Favorites = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <PanelPadded isFavorites={true}>
                    <div className='section group'>
                        <TracksPreview />
                    </div>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

// MAP OVER OBJECTS
// var o = {foo: 'bar', de: 'lu'};
// var blah = Object.keys(o).map(function(k) {return k + " has " + o[k]; });
// Object.keys(o) = ['foo', 'de']
// blah = ['foo has bar', 'de has lu']


var Subscriptions = React.createClass({
    render: function() {
        var currentUser = this.props.data.currentUser;
        var subscriptionsData = this.props.data.subscriptionsData;
        var currentUserSubscriptions = subscriptionsData.users[currentUser.id].subscriptions;
        console.log(currentUserSubscriptions);
        var subscriptionRow = currentUserSubscriptions.map(function(sub) {
            return (
                <div className='section group'>
                    <SubscriptionPicture avatarUrl={sub.avatar_url} username={sub.username} id={sub.id} />
                    <TracksSlider tracks={sub.tracks} />
                </div>
            );
        });
        return (
            <div className='main-content'>
                <PanelPadded isSubscriptions={true}>
                    {subscriptionRow}
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});



var SubscriptionPicture = React.createClass({
    render: function() {
        return (
            <div className='col span_1_of_4'>
                <Link to={'/profile/' + this.props.id}>
                    <div className='picture picture-subscription'>
                        <img src={this.props.avatarUrl} />
                    </div>
                </Link>
            </div>
        );
    }
});

var TracksSlider = React.createClass({
    render: function() {
        //this.props.tracks
        return (
            <div className='col span_3_of_4'>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile title='Track Title' description='Description 1 description blah blah blah' col='col-first' />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile title='Track Title' description='Description 1 description blah blah blah' col='col-first' />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile title='Track Title' description='Description 1 description blah blah blah' col='col-first' />
                </div>
            </div>
        );
    }
});

var Settings = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Footer />
            </div>
        );
    }
});

var Logout = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Footer />
            </div>
        );
    }
});

var Footer = React.createClass({
    render: function() {
        return (
            <footer className='section panel footerbar'>
                <p>
                    Copyright © 2014 LineOnline. All Rights Reserved.
                </p>
            </footer>
        );
    }
});

var GalleryPreview = React.createClass({
    render: function() {
        return (
            <div className='section group'>
                <GalleryCol headerTitle='Hot' headerIcon='pulse' col='col-first' />
                <GalleryCol headerTitle='Top' headerIcon='star' col='col-mid' />
                <GalleryCol headerTitle='New' headerIcon='clock' col='col-last' />
                <Link to='gallery'>
                    <button className='btn btn-see-more'>
                        See More
                    </button>
                </Link>
            </div>
        );
    }
});

var CollectionsPreview = React.createClass({
    render: function() {
        var tracksCols = {
            0: [],
            1: [],
            2: []
        };
        this.props.collectionTracks.forEach(function(track, idx) {
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

var TracksPreview = React.createClass({
    render: function() {
        return (
            <div className='section group'>
                <TracksCol col='col-first' />
                <TracksCol col='col-mid' />
                <TracksCol col='col-last' />
            </div>
        );
    }
});



var GalleryTile = React.createClass({
    render: function() {
        return (
            <GalleryRow>
                <article className={'tile ' + this.props.col}>
                    <div className='preview'>
                        <Icon class='preview-icon' icon='fullscreen-enter' />
                    </div>
                    <div className='info'>
                        <h3>
                            {this.props.title}
                        </h3>
                        <p>
                            {this.props.description}
                        </p>
                    </div>
                </article>
            </GalleryRow>
        );
    }
});

var GalleryHeader = React.createClass({
    render: function() {
        return (
            <GalleryRow>
                <h2 className='header-col'>
                    <Icon class='header-icon' icon={this.props.icon} />
                    <span className='header-title'>
                        {this.props.title}
                    </span>
                </h2>
            </GalleryRow>
        );
    }
});

var GalleryCol = React.createClass({
    render: function() {
        // var cx = React.addons.classSet;
        // var classes = cx({
        //     'gallery-col': true,
        //     'col': true,
        //     'span_1_of_3': true,
        //     'col-first': this.props.isFirst,
        //     'col-mid': this.props.isMid,
        //     'col-last': this.props.isLast
        // });
        return (
            <div className='gallery-col col span_1_of_3'>
                <GalleryHeader title={this.props.headerTitle} icon={this.props.headerIcon} />
                <GalleryTile title='Track Title' description='Description 1 description blah blah blah' col={this.props.col} />
                <GalleryTile title='Track Title' description='Description 2 description blah blah blah' col={this.props.col} />
            </div>
        );
    }
});

var TracksCol = React.createClass({
    render: function() {
        var tracks = this.props.tracks;
        var galleryTiles = this.props.tracks.map(function(track) {
            console.log(this.props);
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

var GalleryRow = React.createClass({
    render: function() {
        return (
            <div className='gallery-row section group'>
                {this.props.children}
            </div>
        );
    }
});

var ScrollDivider = React.createClass({
    render: function() {
        return (
            <div className='scroll-divider'>
                <a href={this.props.link} className='scroll-link'>
                    <Icon class='scroll-icon' icon='chevron-bottom' />
                </a>
            </div>
        );
    }
});

var Panel = React.createClass({
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'panel': true,
            'masthead': this.props.isMasthead,
            'editor': this.props.isEditor,
            'gallery': this.props.isGallery,
            'favorites': this.props.isFavorites,
            'your-tracks': this.props.isYourTracks,
            'profile': this.props.isProfile,
            'subscriptions': this.props.isSubscriptions
        });
        return (
            <section className={classes} id={this.props.id}>
                {this.props.children}
            </section>
        );
    }
});

var PanelPadded = React.createClass({
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'panel': true,
            'masthead': this.props.isMasthead,
            'editor': this.props.isEditor,
            'gallery': this.props.isGallery,
            'favorites': this.props.isFavorites,
            'your-tracks': this.props.isYourTracks,
            'profile': this.props.isProfile,
            'subscriptions': this.props.isSubscriptions
        });
        return (
            <section className={classes} id={this.props.id}>
                <div className='panel-padded'>
                    {this.props.children}
                </div>
            </section>
        );
    }
});

var Navbar = React.createClass({
    getInitialState: function() {
        return {
            hidden: true
        };
    },
    handleAnyClick: function(event) {
        if (!this.state.hidden) {
            this.setState({
                hidden: true
            });
        }
        window.removeEventListener('click', this.handleAnyClick);
    },
    handleDropdownClick: function(event) {
        if (this.state.hidden) {
            this.setState({
                hidden: false
            });
            event.stopPropagation();
            window.addEventListener('click', this.handleAnyClick);
        }
    },
    render: function() {
        return (
            <nav className='navbar'>
                <ul className='nav-list section group'>
                    <li className='nav-item nav-item-logo nav-item-active col span_1_of_7'>
                       <Link to='app' className='navlink'>
                            LineOnline
                        </Link>
                    </li>
                    <Navlink title='Home' link='home' icon='home' />
                    <Navlink title='Gallery' link='gallery' icon='image' />
                    <Navlink title='Your Tracks' link='your-tracks' icon='project' />
                    <li className='nav-item col span_2_of_7'></li>
                    <li className='nav-item nav-item-profile col span_1_of_7'>
                        <div className='navlink' onClick={this.handleDropdownClick}>
                            <img src={this.props.currentUser.avatar_url} />
                            <span className='hidden'>
                                Profile
                            </span>
                        </div>
                            <Dropdown
                                username={this.props.currentUser.username}
                                id={this.props.currentUser.id}
                                isHidden={this.state.hidden}
                            />
                    </li>
                </ul>
            </nav>
        );
    }
});

var Icon = React.createClass({
    render: function() {
        return (
            <span className={this.props.class + ' oi'} data-glyph={this.props.icon} title={this.props.icon} aria-hidden='true'></span>
        );
    }
});

var Dropdown = React.createClass({
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'dropdown': true,
            'dropdown-settings': true,
            'hidden': this.props.isHidden
        });
        return (
            <div className={classes}>
                <ul>
                    <li className='dropdown-item dropdown-profile'>
                        <Link to={'/profile/' + this.props.id} className='dropdown-link'>
                            <div className='name'>
                                {this.props.username}
                            </div>
                            <div className='description'>
                                <Icon class='dropdown-icon' icon='person' />
                                <span className='dropdown-title'>
                                    View Your Profile
                                </span>
                            </div>
                        </Link>
                    </li>
                    <DropdownItem title='Favorites' link='favorites' icon='heart' />
                    <DropdownItem title='Subscriptions' link='subscriptions' icon='people' />
                    <DropdownItem title='Settings' link='settings' icon='cog' />
                    <DropdownItem title='Logout' link='logout' icon='account-logout' />
                </ul>
            </div>
        );
    }
});

var DropdownItem = React.createClass({
    render: function() {
        return (
            <li className='dropdown-item'>
                <Link to={this.props.link} className='dropdown-link'>
                    <Icon class='dropdown-icon' icon={this.props.icon} />
                    <span className='dropdown-title'>
                        {this.props.title}
                    </span>
                </Link>
            </li>
        );
    }
});

var Navlink = React.createClass({
    render: function() {
        return (
            <li className='nav-item col span_1_of_7'>
                <Link to={this.props.link} className='navlink'>
                    <Icon class='navlink-icon' icon={this.props.icon} />
                    <span className='navlink-title'>
                        { this.props.title }
                    </span>
                </Link>
            </li>
        );
    }
});

var routes = (
    <Routes location='history'>
        <Route name='app' path='/' handler={App}>
            <DefaultRoute name='index' handler={Index} />
            <Route name='home' handler={Home} />
            <Route name='gallery' handler={Gallery} />
            <Route name='your-tracks' handler={YourTracks} />
            <Route name='profile' path='/profile/:profileId' handler={Profile} />
            <Route name='favorites' handler={Favorites} />
            <Route name='subscriptions' handler={Subscriptions} />
            <Route name='settings' handler={Settings} />
            <Route name='logout' handler={Logout} />
            <Route name='subscribe' handler={Profile} />
            <NotFoundRoute handler={NotFound} />
        </Route>
    </Routes>
);

module.exports = function doRender(target, callback) {
    React.render(routes, target, callback);
};
