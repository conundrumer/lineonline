var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');
var _ = require('underscore');

//Actions
var Actions = require('../actions');

//Data Stores
var ProfileStore = require('../stores/profile');

//UI Components
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Settings = React.createClass({
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
        if (this.props.currentUser) {
            Actions.getProfile(this.props.currentUser.user_id);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.currentUser !== nextProps.currentUser
            && nextProps.currentUser) {
            Actions.getProfile(nextProps.currentUser.user_id);
        }
    },
    sanitizeTextData: function(data) {
        if (data === null) {
            return '';
        } else {
            return data.trim();
        }
    },
    handleSubmit: function(e) {
        e.preventDefault();
        console.log('submitting...');
        var profileData = {
            username: this.sanitizeTextData(this.state.data.profile.username),
            avatar_url: this.sanitizeTextData(this.state.data.profile.avatar_url),
            email: this.sanitizeTextData(this.state.data.profile.email),
            location: this.sanitizeTextData(this.state.data.profile.location),
            about: this.sanitizeTextData(this.state.data.profile.about)
        }
        console.log(profileData);
        Actions.updateProfile(this.props.currentUser.user_id, profileData);
    },
    handleChange: function(inputName) {
        return function(e) {
            var newData = {};
            newData[inputName] = e.target.value;
            var newProfile = _.extend(this.state.data.profile, newData)
            this.setState({
                data: _.extend(this.state.data, { profile: newProfile })
            });
        }.bind(this);
    },
    render: function() {
        console.log('got profileeeeee');
        console.log(this.state.data.profile);
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
                                    <form className='form-settings form-settings-profile' onSubmit={this.handleSubmit}>
                                        <div className='section group'>
                                            <div className='field col span_6_of_12'>
                                                <label for='username'>
                                                    Username
                                                </label>
                                                <input
                                                    name='username'
                                                    type='text'
                                                    value={this.state.data.profile.username}
                                                    onChange={this.handleChange('username')}
                                                />
                                            </div>
                                            <div className='field col span_6_of_12'>
                                                <label for='email'>
                                                    Email
                                                </label>
                                                <input
                                                    name='email'
                                                    type='email'
                                                    value={this.state.data.profile.email}
                                                    onChange={this.handleChange('email')}
                                                />
                                            </div>
                                        </div>

                                        <div className='section group'>
                                            <div className='field col span_12_of_12'>
                                                <label for='avatarUrl'>
                                                    Avatar URL:
                                                </label>
                                                <input
                                                    name='avatarUrl'
                                                    type='text'
                                                    value={this.state.data.profile.avatar_url}
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
