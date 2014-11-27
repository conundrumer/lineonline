var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
// var FavoritesStore = require('../stores/favorites');

//UI Components
var TracksPreview = require('./GalleryPreview.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Favorites = React.createClass({
    render: function() {
        var id = this.props.data.currentUser.id;
        var favoritesData = this.props.data.favoritesData.users[id];
        return (
            <div className='main-content'>
                <PanelPadded isFavorites={true}>
                    <div className='section group'>
                        <TracksPreview tracks={favoritesData.favorites} />
                    </div>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

module.exports = Favorites;
