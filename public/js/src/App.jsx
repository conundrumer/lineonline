var React = require('react/addons');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

// when you refactor this file, relative paths are gonna get messed up
var Editor = require('./linerider/Editor.jsx');
var Data = require('./store');
var Action = require('./action');

// var names = ['delu', 'jing', 'what'];

//data={this.props.data.index} currentUser={this.props.data.currentUser}


//Sample Users


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

var NotFound = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <PanelPadded isNotFound={true}>
                    <p>404 Not Found </p>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

var Index = React.createClass({
    // var { currentUser, index, ...other } = this.props.data;
    render: function() {
        return (
            <div className='main-content'>
                <Panel isMasthead={true} id='masthead-panel' />
                <ScrollDivider link='#editor-panel' />
                <Link to={'/home'}>
                    <Panel isEditor={true} id='editor-panel' />
                </Link>
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
                <Panel>
                    <Editor
                        onSaveTrack={null}
                        onAddLine={null}
                        onRemoveLine={null}
                    />
                    <Conversation />
                </Panel>
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
        var id = this.props.data.currentUser.id;
        var yourTracksData = this.props.data.yourTracksData.users[id];
        return (
            <div className='main-content'>
                <Panel isYourTracks={true}>
                    <div className='panel-padded'>
                        <div className='section group'>
                            <TracksPreview tracks={yourTracksData.your_tracks} />
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
        var id = this.props.data.currentUser.id;
        var favoritesData = this.props.data.favoritesData.users[id];
        return (
            <div className='main-content'>
                <PanelPadded isFavorites={true}>
                    <div className='section group'>
                        <TracksPreview tracks={favoritesData.favorites} />
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

// var TracksPreview = React.createClass({
//     render: function() {
//         return (
//             <div className='section group'>
//                 <TracksCol col='col-first' />
//                 <TracksCol col='col-mid' />
//                 <TracksCol col='col-last' />
//             </div>
//         );
//     }
// });



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
            'subscriptions': this.props.isSubscriptions,
            'not-found': this.props.isNotFound
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
                    {this.props.currentUser ?
                        <Navlink title='Home' link='home' icon='home' />
                        : null
                    }
                    <Navlink title='Gallery' link='gallery' icon='image' />
                    {this.props.currentUser ?
                        <Navlink title='Your Tracks' link='your-tracks' icon='project' />
                        : null
                    }
                    {this.props.currentUser ?
                        <li className='nav-item col span_2_of_7'></li>
                        : <li className='nav-item col span_4_of_7'></li>
                    }
                    {this.props.currentUser ?
                        <li className='nav-item nav-item-profile col span_1_of_7'>
                            <div className='navlink' onClick={this.handleDropdownClick}>
                                <img src={this.props.currentUser.avatar_url} />
                                <span className='hide'>
                                    Profile
                                </span>
                            </div>
                            <Dropdown
                                username={this.props.currentUser.username}
                                id={this.props.currentUser.id}
                                isHidden={this.state.hidden}
                            />
                        </li>

                        :

                        <li className='nav-item nav-item-signup-login col span_1_of_7'>
                            <div className='navlink' onClick={this.handleDropdownClick}>
                                <Icon class='navlink-icon' icon='account-login' />
                                <span className='navlink-title'>
                                    Sign Up/Log In
                                </span>
                            </div>
                            <DropdownLogin isHidden={this.state.hidden} />
                        </li>
                    }

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

var DropdownLogin = React.createClass({
    getInitialState: function() {
        return {
            signup: true,
            signup_form_username: '',
            signup_form_password: '',
            signup_form_email: '',
            login_form_username: '',
            login_form_password: ''
        };
    },
    handleContainerClick: function (event) {
        event.stopPropagation();
    },
    handleLoginClick: function() {
        this.setState({
            signup: !this.state.signup
        });
    },
    handleTransitionEnd: function(event) {
        this.setState({
            signup: true
        });
        this.refs.dropdown.getDOMNode().removeEventListener('transitionend', this.handleTransitionEnd);
    },
    componentWillReceiveProps: function(nextProps) {
        // from visible to hidden
        if (!this.props.isHidden && nextProps.isHidden) {
            this.refs.dropdown.getDOMNode().addEventListener('transitionend', this.handleTransitionEnd);
        }
    },
    handleChange: function(inputName) {
        return function (event, value) {
            // console.log(event.target.value);
            var state = {}
            state[inputName] = event.target.value;
            this.setState(state);
        }.bind(this);
    },
    handleSignupSubmit: function(event) {
        event.preventDefault();
        var username = this.refs.signupUsername.getDOMNode().value.trim();
        var email = this.refs.signupEmail.getDOMNode().value.trim();
        var password = this.refs.signupPassword.getDOMNode().value.trim();
        Action.signup({
            username: username,
            email: email,
            password: password
        });
    },
    handleLoginSubmit: function(event) {
        event.preventDefault();
        var username = this.refs.loginUsername.getDOMNode().value.trim();
        var password = this.refs.loginPassword.getDOMNode().value.trim();

        Action.login({
            username: username,
            password: password
        });
    },
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'dropdown': true,
            'dropdown-signup-login': true,
            'hidden': this.props.isHidden
        });
        return (
            <div ref='dropdown' onClick={this.handleContainerClick} className={classes}>
                <div id='form-signup' className={this.state.signup ? '' : 'hidden'}>
                    <form className='form-signup-login' onSubmit={this.handleSignupSubmit}>
                        <div className='field'>
                            <label for='username'>
                                Username:
                            </label>
                            <input ref='signupUsername' name='username' type='text' placeholder='username' onChange={this.handleChange('signup_form_username')} />
                        </div>
                        <div className='field'>
                            <label for='email'>
                                Email:
                            </label>
                            <input ref='signupEmail' name='email' type='email' placeholder='email' onChange={this.handleChange('signup_form_email')} />
                        </div>
                        <div className='field field-last'>
                            <label for='password'>
                                Password:
                            </label>
                            <input ref='signupPassword' name='password' type='password' placeholder='••••••••••••' onChange={this.handleChange('signup_form_password')} />
                        </div>
                        <button className='btn-submit' type='submit'>
                            Sign Up
                        </button>
                    </form>
                    <div className='footnote'>
                        <p>
                            Or <span className='login-link' onClick={this.handleLoginClick}>log in</span> with an existing account
                        </p>
                    </div>
                </div>
                <div id='form-login' className={this.state.signup ? 'hidden' : ''}>
                    <form className='form-signup-login' onSubmit={this.handleLoginSubmit}>
                        <div className='field'>
                            <label for='username'>
                                Username:
                            </label>
                            <input ref='loginUsername'  name='username' type='text' placeholder='username' onChange={this.handleChange('login_form_username')} />
                        </div>
                        <div className='field field-last'>
                            <label for='password'>
                                Password:
                            </label>
                            <input ref='loginPassword' name='password' type='password' placeholder='••••••••••••' onChange={this.handleChange('login_form_password')} />
                        </div>
                        <button className='btn-submit' type='submit'>
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        );
    }
});

var Dropdown = React.createClass({
    handleLogout: function(event) {
        event.preventDefault();
        Action.logout();
    },
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
                    <DropdownItem title='Logout' link='logout' icon='account-logout' onClick={this.handleLogout} />
                </ul>
            </div>
        );
    }
});

var DropdownItem = React.createClass({
    render: function() {
        return (
            <li className='dropdown-item' onClick={this.props.onClick}>
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
            <Route name='logout' handler={Index} />
            <Route name='subscribe' handler={Profile} />
            <NotFoundRoute handler={NotFound} />
        </Route>
    </Routes>
);

function doRender(target, callback) {
    React.render(routes, target, callback);
};

Data.onUpdate = doRender.bind(null, document.body, function(){});

module.exports = doRender;
