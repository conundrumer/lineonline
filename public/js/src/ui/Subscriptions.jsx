var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var SubscriptionsStore = require('../stores/subscriptions');

//UI Components
var TracksSlider = require('./TracksSlider.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Subscriptions = React.createClass({
    mixins: [
        Reflux.listenTo(SubscriptionsStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: SubscriptionsStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.currentUser) {
            Actions.getSubscriptions();
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if ((this.props.currentUser !== nextProps.currentUser)
            && nextProps.currentUser) {
            Actions.getSubscriptions();
        }
    },
    render: function() {
        // var currentUser = this.props.data.currentUser;
        // var subscriptionsData = this.props.data.subscriptionsData;
        // var currentUserSubscriptions = subscriptionsData.users[currentUser.id].subscriptions;
        console.log(this.state.data.subscriptions);
        var subscriptionRow = [];
        if (this.props.currentUser && this.state.data.subscriptions) {
            subscriptionRow = this.state.data.subscriptions.map(function(sub) {
                return (
                    <div className='section group'>
                        <SubscriptionPicture avatarUrl={sub.subscribee.avatar_url} username={sub.subscribee.username} userId={sub.subscribee.user_id} />
                        <TracksSlider tracks={sub.track_snippets} />
                    </div>
                );
            });
        }

        return (
            <div className='main-content'>
                {this.props.currentUser && this.state.data.subscriptions ?
                    <div>
                        <PanelPadded isSubscriptions={true}>
                            {subscriptionRow}
                        </PanelPadded>
                        <Footer />
                    </div>
                    : null
                }
            </div>
        );
    }
});

var SubscriptionPicture = React.createClass({
    render: function() {
        console.log('rendering pic');
        return (
            <div className='col span_1_of_4'>
                <Link to={'/profile/' + this.props.userId}>
                    <div className='picture picture-subscription'>
                        <img src={this.props.avatarUrl} />
                    </div>
                </Link>
            </div>
        );
    }
});

module.exports = Subscriptions;