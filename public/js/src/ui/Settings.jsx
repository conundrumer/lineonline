var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');
var _ = require('underscore');

//Actions
var Actions = require('../actions');

//Data Stores
var CurrentUserStore = require('../stores/current-user');

//UI Components
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Settings = React.createClass({
    mixins: [
        Reflux.listenTo(CurrentUserStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: CurrentUserStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.currentUser) {
            Actions.getCurrentProfile(this.props.currentUser.user_id);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.currentUser !== nextProps.currentUser
            && nextProps.currentUser) {
            Actions.getCurrentProfile(nextProps.currentUser.user_id);
        }
    },
    sanitizeTextData: function(data) {
        if (data === null) {
            return '';
        } else {
            return data.trim();
        }
    },
    sanitizeAvatarUrl: function(url) {
        if (url === '') {
            return '/images/default.png';
        } else {
            //http://
            var http = url.slice(0, 7);
            var https = url.slice(0, 8);
            var newUrl = url;
            if (http !== 'http://' && https !== 'https://') {
                console.log('not equal!');
                newUrl = 'http://' + url;
                var newData = {};
                newData['avatar_url'] = newUrl;
                var newProfile = _.extend(this.state.data.profile, newData)
                this.setState({
                    data: _.extend(this.state.data, { profile: newProfile })
                });
            }
            return newUrl;
        }
    },
    handleProfileSubmit: function(e) {
        e.preventDefault();
        console.log('submitting profile...');
        var profileData = {
            avatar_url: this.sanitizeTextData(this.state.data.profile.avatar_url),
            location: this.sanitizeTextData(this.state.data.profile.location),
            about: this.sanitizeTextData(this.state.data.profile.about)
        };
        console.log(profileData);
        Actions.updateCurrentProfile(profileData);
    },
    handleEmailSubmit: function(e) {
        e.preventDefault();
        console.log('submitting email...');
        var emailData = {
            password: this.sanitizeTextData(this.refs.emailCurrentPassword.getDOMNode().value),
            new_email: this.sanitizeTextData(this.state.data.profile.email)
        };
        console.log(emailData);
        Actions.updateEmail(this.props.currentUser.user_id, emailData);
    },
    handlePasswordSubmit: function(e) {
        e.preventDefault();
        console.log('submitting password...');
        var passwordData = {
            password: this.sanitizeTextData(this.refs.passwordCurrentPassword.getDOMNode().value),
            new_password: this.sanitizeTextData(this.refs.passwordNewPassword.getDOMNode().value),
            confirm_password: this.sanitizeTextData(this.refs.passwordConfirmPassword.getDOMNode().value)
        };
        console.log(passwordData);
        Actions.updatePassword(passwordData);
    },
    handleChange: function(inputName) {
        return function(e) {
            var value = e.target.value;
            if (inputName === 'avatar_url') {
                if (value === '') {
                    value = '/images/default.png';
                } else {
                    var http = value.slice(0, 7);
                    var https = value.slice(0, 8);
                    if (http !== 'http://' && https !== 'https://') {
                        console.log('not equal!');
                        value = 'http://' + value;
                    }
                }
            }
            var newData = {};
            newData[inputName] = value;
            var newProfile = _.extend(this.state.data.profile, newData)
            this.setState({
                data: _.extend(this.state.data, { profile: newProfile })
            });
        }.bind(this);
    },
    render: function() {
        console.log('got profileeeeee');
        console.log(this.state.data.profile);
        var avatarUrlShown = '';
        if (this.props.currentUser && this.state.data.profile) {
            avatarUrlShown = (this.state.data.profile.avatar_url === '/images/default.png') ? '' : this.state.data.profile.avatar_url;
        }
        return (
            <div className='main-content'>
                {this.props.currentUser && this.state.data.profile ?
                    <div>
                        <PanelPadded isSettings={true}>
                            <div className='section group profile-form'>
                                <div className='col span_2_of_12'>
                                </div>
                                <div className='col span_8_of_12'>
                                    <h2>Profile Settings</h2>
                                    <form className='form-settings form-settings-profile' onSubmit={this.handleProfileSubmit}>
                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='avatarUrl'>
                                                    Avatar URL:
                                                </label>
                                                <input
                                                    name='avatarUrl'
                                                    placeholder='http://'
                                                    type='text'
                                                    value={avatarUrlShown}
                                                    onChange={this.handleChange('avatar_url')}
                                                />
                                            </div>
                                        </div>

                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='location'>
                                                    Location:
                                                </label>
                                                <input
                                                    name='location'
                                                    placeholder='somewhere...'
                                                    type='text'
                                                    value={this.state.data.profile.location}
                                                    onChange={this.handleChange('location')}
                                                />
                                            </div>
                                        </div>

                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='about'>
                                                    About:
                                                </label>
                                                <textarea
                                                    name='about'
                                                    placeholder='write something about yourself...'
                                                    value={this.state.data.profile.about}
                                                    onChange={this.handleChange('about')}
                                                />
                                            </div>
                                        </div>

                                        <button className='btn btn-submit' value='submit'>
                                            Save Profile
                                        </button>
                                    </form>
                                </div>
                                <div className='col span_2_of_12'>
                                </div>
                            </div>

                            <div className='section group email-form'>
                                <div className='col span_2_of_12'>
                                </div>
                                <div className='col span_8_of_12'>
                                    <h2>Email Settings</h2>
                                    <form className='form-settings form-settings-email' onSubmit={this.handleEmailSubmit}>
                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='currentPassword'>
                                                    Current Password:
                                                </label>
                                                <input
                                                    ref='emailCurrentPassword'
                                                    name='currentPassword'
                                                    placeholder='••••••••••••'
                                                    type='password'
                                                />
                                            </div>
                                        </div>
                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='email'>
                                                    Email:
                                                </label>
                                                <input
                                                    name='email'
                                                    placeholder='example@gmail.com'
                                                    type='email'
                                                    value={this.state.data.profile.email}
                                                    onChange={this.handleChange('email')}
                                                />
                                            </div>
                                        </div>

                                        <button className='btn btn-submit' value='submit'>
                                            Save Email
                                        </button>
                                    </form>
                                </div>
                                <div className='col span_2_of_12'>
                                </div>
                            </div>

                            <div className='section group password-form'>
                                <div className='col span_2_of_12'>
                                </div>
                                <div className='col span_8_of_12'>
                                    <h2>Password Settings</h2>
                                    <form className='form-settings form-settings-password' onSubmit={this.handlePasswordSubmit}>
                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='currentPassword'>
                                                    Current Password:
                                                </label>
                                                <input
                                                    ref='passwordCurrentPassword'
                                                    name='currentPassword'
                                                    placeholder='••••••••••••'
                                                    type='password'
                                                />
                                            </div>
                                        </div>
                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='newPassword'>
                                                    New Password:
                                                </label>
                                                <input
                                                    ref='passwordNewPassword'
                                                    name='newPassword'
                                                    placeholder='••••••••••••'
                                                    type='password'
                                                />
                                            </div>
                                        </div>
                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='confirmPassword'>
                                                    Confirm Password:
                                                </label>
                                                <input
                                                    ref='passwordConfirmPassword'
                                                    name='confirmPassword'
                                                    placeholder='••••••••••••'
                                                    type='password'
                                                />
                                            </div>
                                        </div>
                                        <button className='btn btn-submit' value='submit'>
                                            Save Password
                                        </button>
                                    </form>
                                </div>
                                <div className='col span_2_of_12'>
                                </div>
                            </div>


                        </PanelPadded>
                        <Footer />
                    </div>
                    : null
                }
            </div>
        );
    }
});

module.exports = Settings;
