var React = require('react/addons');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('./actions');

//Data Stores
var AuthStore = require('./stores/auth');
var ProfileStore = require('./stores/profile');

//UI Components
var Icon = require('./ui/Icon.jsx');
var Index = require('./ui/Index.jsx');
var Home = require('./ui/Home.jsx');
var Editor = require('./ui/Editor.jsx');
var Gallery = require('./ui/Gallery.jsx');
var Profile = require('./ui/Profile.jsx');
var Favorites = require('./ui/Favorites.jsx');
var Subscriptions = require('./ui/Subscriptions.jsx');
var Settings = require('./ui/Settings.jsx');
var NotFound = require('./ui/NotFound.jsx');
var Footer = require('./ui/Footer.jsx');

//linerider
// when you refactor this file, relative paths are gonna get messed up
var LineriderEditor = require('./linerider/Editor.jsx');

var App = React.createClass({
    mixins: [
        Reflux.listenTo(AuthStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: AuthStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        Actions.getCurrentUser();
    },
    render: function() {
        var data = this.state.data;
        console.log('HELLOOO', data);
        return (
            <div className='container'>
                <Navbar currentUser={data.currentUser} errorMessages={data.errorMessages} />
                <this.props.activeRouteHandler data={data} />
            </div>
        );
    }
});


// MAP OVER OBJECTS
// var o = {foo: 'bar', de: 'lu'};
// var blah = Object.keys(o).map(function(k) {return k + " has " + o[k]; });
// Object.keys(o) = ['foo', 'de']
// blah = ['foo has bar', 'de has lu']

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
                    {this.props.currentUser ?
                        <Navlink title='Editor' link='editor' icon='pencil' />
                        : null
                    }
                    <Navlink title='Gallery' link='gallery' icon='image' />
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
                                id={this.props.currentUser.user_id}
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
                            <DropdownLogin isHidden={this.state.hidden} signupErrorMessage={this.props.errorMessages.signup} loginErrorMessage={this.props.errorMessages.login} />
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
        Actions.signup({
            username: username,
            email: email,
            password: password
        });
    },
    handleLoginSubmit: function(event) {
        event.preventDefault();
        var username = this.refs.loginUsername.getDOMNode().value.trim();
        var password = this.refs.loginPassword.getDOMNode().value.trim();

        Actions.login({
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
                    {this.props.signupErrorMessage ?
                        <div className='footnote error-message'>
                            <p>
                                {this.props.signupErrorMessage}
                            </p>
                        </div>
                        : null
                    }
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
                    {this.props.loginErrorMessage ?
                        <div className='footnote error-message'>
                            <p>
                                {this.props.loginErrorMessage}
                            </p>
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
});

var Dropdown = React.createClass({
    handleLogout: function(event) {
        event.preventDefault();
        Actions.logout();
    },
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'dropdown': true,
            'dropdown-settings': true,
            'hidden': this.props.isHidden
        });
        console.log('ajkldfdajklfa ', this.props);
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
                    <DropdownItem title='Logout' icon='account-logout' onClick={this.handleLogout} />
                </ul>
            </div>
        );
    }
});

var DropdownItem = React.createClass({
    render: function() {
        return (
            <li className='dropdown-item' onClick={this.props.onClick}>
                {this.props.link ?
                    <Link to={this.props.link} className='dropdown-link'>
                        <Icon class='dropdown-icon' icon={this.props.icon} />
                        <span className='dropdown-title'>
                            {this.props.title}
                        </span>
                    </Link>
                    :
                    <div>
                        <Icon class='dropdown-icon' icon={this.props.icon} />
                        <span className='dropdown-title'>
                            {this.props.title}
                        </span>
                    </div>
                }
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
            <Route name='editor' handler={Editor} />
            <Route name='gallery' handler={Gallery} />
            <Route name='profile' path='/profile/:profileId' handler={Profile} />
            <Route name='favorites' handler={Favorites} />
            <Route name='subscriptions' handler={Subscriptions} />
            <Route name='settings' handler={Settings} />
            <Route name='subscribe' handler={Profile} />
            <NotFoundRoute name='404' handler={NotFound} />
        </Route>
    </Routes>
);

function doRender(target, callback) {
    React.render(routes, target, callback);
};

// Data.onUpdate = doRender.bind(null, document.body, function(){});

module.exports = doRender;
