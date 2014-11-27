var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
// var SubscriptionsStore = require('../stores/subscriptions');

//UI Components
var TracksSlider = require('./TracksSlider.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

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

module.exports = Subscriptions;
