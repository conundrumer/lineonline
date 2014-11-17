var React = require('react/addons');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;

// var names = ['delu', 'jing', 'what'];

var App = React.createClass({
    render: function() {
        // return (
        //     <div className='login-link'>
        //         {names.map(function(n) {
        //             return <Hello name={n} />
        //         })}
        //     </div>
        // );
        return (
            <div className='container'>
                <Navbar />
                <this.props.activeRouteHandler />
            </div>
        );
    }
});

var Index = React.createClass({
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
                <Panel isEditor={true} id='editor-panel'>
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


var Gallery = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <PanelPadded isGallery={true} id='gallery-panel'>
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

var Profile = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <PanelPadded isProfile={true}>
                    <div className='section group'>
                        <div className='col span_1_of_4'>
                            <ProfileSidebar username='Bob Blob' location='Pittsburgh, PA' email='bobblob@gmail.com' description='Blah blah blah' />
                        </div>
                        <div className='col span_3_of_4'>
                            <ProfileMain username='Bob Blob' featuredTrackTitle='Track Title' featuredTrackDescription='Ajksldfjkdsl sajfk jdsakl jdsf' featuredTrackOwner='Bob Blob' featuredTrackCollaborators='Bloop' />
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
                <ProfileFeaturedTrack title={this.props.featuredTrackTitle} description={this.props.featuredTrackDescription} owner={this.props.featuredTrackOwner} collaborators={this.props.featuredTrackCollaborators} />
                <ProfileTracks />
            </section>
        );
    }
});

var ProfileFeaturedTrack = React.createClass({
    render: function() {
        return (
            <article className='track-featured'>
                <Icon class='preview-icon' icon='fullscreen-enter' />
                <MediaIcons />
                <aside className='info'>
                    <h3>{this.props.title}</h3>
                    <p>
                        {this.props.description}
                    </p>
                    <h3>Owner</h3>
                    <p>{this.props.owner}</p>
                    <h3>Collaborators</h3>
                    <ul>
                        <li>{this.props.collaborators}</li>
                    </ul>
                </aside>
            </article>
        );
    }
});

var ProfileTracks = React.createClass({
    render: function() {
        return (
            <article className='track-collection'>
                <TracksPreview />
            </article>
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



var Subscriptions = React.createClass({
    render: function() {
        // <div className='section group'>
        //     <ProfilePicture />
        //     <TracksSlider />
        // </div>
        return (
            <div className='main-content'>
                <PanelPadded isSubscriptions={true}>
                    <div className='section group'>
                        <SubscriptionPicture />
                        <TracksSlider />
                    </div>


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
                <div className='picture picture-subscription' />
            </div>
        );
    }
});

var TracksSlider = React.createClass({
    render: function() {
        return (
            <div className='col span_3_of_4'>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile trackTitle='Track Title' trackDescription='Description 1 description blah blah blah' col='col-first' />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile trackTitle='Track Title' trackDescription='Description 1 description blah blah blah' col='col-first' />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile trackTitle='Track Title' trackDescription='Description 1 description blah blah blah' col='col-first' />
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
                            {this.props.trackTitle}
                        </h3>
                        <p>
                            {this.props.trackDescription}
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
                <GalleryTile trackTitle='Track Title' trackDescription='Description 1 description blah blah blah' col={this.props.col} />
                <GalleryTile trackTitle='Track Title' trackDescription='Description 2 description blah blah blah' col={this.props.col} />
            </div>
        );
    }
});

var TracksCol = React.createClass({
    render: function() {
        return (
            <div className='gallery-col col span_1_of_3'>
                <GalleryTile trackTitle='Track Title' trackDescription='Description 1 description blah blah blah' col={this.props.col} />
                <GalleryTile trackTitle='Track Title' trackDescription='Description 1 description blah blah blah' col={this.props.col} />
                <GalleryTile trackTitle='Track Title' trackDescription='Description 2 description blah blah blah' col={this.props.col} />
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
                        <div className='navlink'>
                            <span className='hidden'>
                                Profile
                            </span>
                        </div>
                        <Dropdown />
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
        return (
            <div className='dropdown dropdown-settings hidden'>
                <ul>
                    <li className='dropdown-item dropdown-profile'>
                        <Link to='profile' className='dropdown-link'>
                            <div className='name'>
                                Bob Blob
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
            <Route name='profile' handler={Profile} />
            <Route name='favorites' handler={Favorites} />
            <Route name='subscriptions' handler={Subscriptions} />
            <Route name='settings' handler={Settings} />
            <Route name='logout' handler={Logout} />
            <Route name='subscribe' handler={Profile} />
        </Route>
    </Routes>
);

module.exports = function doRender(target, callback) {
    React.render(routes, target, callback);
};
