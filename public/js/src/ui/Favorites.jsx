var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');
var ErrorActions = require('../actions-error');

//Data Stores
var FavoritesStore = require('../stores/favorites');

//UI Components
var TracksPreview = require('./TracksPreview.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Favorites = React.createClass({
    mixins: [
        Reflux.listenTo(FavoritesStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        if (this.isMounted()) {
            this.setState({
                data: newData
            });
        }
    },
    getInitialState: function() {
        return {
            data: FavoritesStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.currentUser) {
            Actions.getFavorites();
        } else {
            ErrorActions.throwError({
                message: 'You are not logged in.'
            });
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if ((this.props.currentUser !== nextProps.currentUser)
            && nextProps.currentUser) {
            Actions.getFavorites();
        }
    },
    render: function() {
        return (
            <div className='main-content'>
                {this.props.currentUser && this.state.data.favorites ?
                    <div>
                        <PanelPadded isFavorites={true}>
                            <div className='section group'>
                                {this.state.data.favorites.length > 0 ?
                                    <TracksPreview userId={this.props.currentUser} tracks={this.state.data.favorites} />
                                    :
                                    <p className='message-panel message-panel-center'>
                                        No favorites to show.
                                    </p>
                                }
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

module.exports = Favorites;
