var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var HomeStore = require('../stores/home');

//UI Components
var TracksPreview = require('./TracksPreview.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');
var NotFound = require('./NotFound.jsx');

var Icon = require('./Icon.jsx');
var MediaIcons = require('./MediaIcons.jsx');

var Home = React.createClass({
    mixins: [
        Reflux.listenTo(HomeStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: HomeStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.currentUser) {
            Actions.getInvitations();
            Actions.getYourTracks(this.props.currentUser.user_id);
            Actions.getCollaborations();
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if ((this.props.currentUser !== nextProps.currentUser)
            && nextProps.currentUser) {
            Actions.getInvitations(nextProps.currentUser.user_id);
            Actions.getYourTracks(nextProps.currentUser.user_id);
            Actions.getCollaborations(nextProps.currentUser.user_id);
        }
    },
    render: function() {
        return (
            <div className='main-content'>
                { this.props.currentUser ?
                    // <PanelPadded isHome={true}>
                    <div>
                        { this.state.data.invitations ?
                            <FlexiblePanel
                                title='Invitations'
                                icon='envelope-closed'
                                userId={this.props.currentUser.user_id}
                                extra='invitation'
                                tracks={this.state.data.invitations}
                            />
                            : null
                        }
                        { this.state.data.yourTracks ?
                            <FlexiblePanel
                                title='Your Tracks'
                                icon='project'
                                userId={this.props.currentUser.user_id}
                                extra='your-track'
                                tracks={this.state.data.yourTracks}
                            />
                            : null
                        }
                        { this.state.data.collaborations ?
                            <FlexiblePanel
                                title='Collaborations'
                                icon='people'
                                userId={this.props.currentUser.user_id}
                                extra='collaboration'
                                tracks={this.state.data.collaborations}
                            />
                            : null
                        }
                    </div>
                    : null
                }
                <Footer />
            </div>
        );
    }
});

var FlexiblePanel = React.createClass({
    render: function() {
        return (
            <section className='panel-flexible'>
                <div className='panel-padded section group'>
                    <div className='section-title'>
                        <Icon class='flexible-icon' icon={this.props.icon} />
                        <span className='flexible-title'>
                            {this.props.title}
                        </span>
                    </div>
                    <TracksPreview userId={this.props.userId} tracks={this.props.tracks} extra={this.props.extra} />
                </div>
            </section>
        );
    }
});

module.exports = Home;
