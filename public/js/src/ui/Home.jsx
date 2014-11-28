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
            Actions.getInvitations();
            console.log(nextProps.currentUser);
            Actions.getYourTracks(nextProps.currentUser.user_id);
            Actions.getCollaborations();
        }
    },
    render: function() {
        return (
            <div className='main-content'>
                { this.props.currentUser ?
                    <PanelPadded isHome={true}>
                        <div className='section group'>
                            { this.state.data.yourTracks ?
                                <TracksPreview tracks={this.state.data.yourTracks} />
                                : null
                            }
                        </div>
                    </PanelPadded>
                    : null
                }
                <Footer />
            </div>
        );
    }
});

module.exports = Home;
