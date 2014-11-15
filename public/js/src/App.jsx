var React = require('react/addons');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
// var Routes = require('react-router/modules/components/Routes');

// React.render((
//     <Routes location='history'>
//         <Route name='app' path='/' handler={App}>
//             <Route name='home' handler={Inbox} />
//         </Route>
//     </Routes>
// ), document.body, LINEONLINE.init.bind(LINEONLINE));

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
                <Panel isGallery={true} id='gallery-panel'>
                    <GalleryPreview />
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
                <Footer />
            </div>
        );
    }
});

var Home = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Panel isEditor={true} id='editor-panel' />
                <Footer />
            </div>
        );
    }
});


var Gallery = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Footer />
            </div>
        );
    }
});

var YourTracks = React.createClass({
    render: function() {
        return (
            <div>
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
            <div className='panel-padded'>
                <GalleryCol headerTitle='Hot' headerIcon='pulse' />
                <GalleryCol headerTitle='Top' headerIcon='star' />
                <GalleryCol headerTitle='New' headerIcon='clock' />
                <Link to='gallery'>
                    <button className='btn btn-see-more'>
                        See More
                    </button>
                </Link>
            </div>
        );
    }
});

var GalleryTile = React.createClass({
    render: function() {
        return (
            <GalleryRow>
                <article className='tile'>
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
        return (
            <div className='gallery-col col span_1_of_3'>
                <GalleryHeader title={this.props.headerTitle} icon={this.props.headerIcon} />
                <GalleryTile trackTitle='Track Title' trackDescription='Description 1 description blah blah blah' />
                <GalleryTile trackTitle='Track Title' trackDescription='Description 2 description blah blah blah' />
            </div>
        );
    }
});

var GalleryRow = React.createClass({
    render: function() {
        return (
            <div className='gallery-row section group row'>
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
            'gallery': this.props.isGallery
        });
        return (
            <section className={classes} id={this.props.id}>
                {this.props.children}
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
            // var isLogo = this.props.logo ?
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


var Hello = React.createClass({
    render: function() {
        return (
            <div>HELEO { this.props.name }</div>
        );
    }
});

module.exports = function doRender(target, callback) {
    React.render((
        <Routes location='history'>
            <Route name='app' path='/' handler={App}>
                <DefaultRoute name='index' handler={Index} />
                <Route name='home' handler={Home} />
                <Route name='gallery' handler={Gallery} />
                <Route name='your-tracks' handler={YourTracks} />
                <Route name='profile' handler={Profile} />
                <Route name='favorites' handler={Profile} />
                <Route name='subscriptions' handler={Profile} />
                <Route name='settings' handler={Profile} />
                <Route name='logout' handler={Profile} />
            </Route>
        </Routes>
    ), target, callback);
};
