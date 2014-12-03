var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

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
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: FavoritesStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.currentUser) {
            Actions.getFavorites();
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
                {this.props.currentUser && this.state.data.favorites
                    && this.state.data.favorites.length > 0 ?
                    <div>
                        <PanelPadded isFavorites={true}>
                            <div className='section group'>
                                <TracksPreview tracks={this.state.data.favorites} />
                            </div>
                        </PanelPadded>
                        <Footer />
                    </div>
                    :
                    <div>
                        <PanelPadded isFavorites={true}>
                            <div className='section group'>
                                <p className='message-panel message-panel-center'>
                                    No favorites to show.
                                </p>
                            </div>
                        </PanelPadded>
                        <Footer />
                    </div>
                }

            </div>
        );
    }
});

module.exports = Favorites;
