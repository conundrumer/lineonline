var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
// var HomeStore = require('../stores/home');

//UI Components
var TracksPreview = require('./GalleryPreview.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Home = React.createClass({
    render: function() {
        var id = this.props.data.currentUser.id;
        var yourTracksData = this.props.data.yourTracksData.users[id];
        return (
            <div className='main-content'>
                <PanelPadded isHome={true}>
                    <div className='section group'>
                        <TracksPreview tracks={yourTracksData.your_tracks} />
                    </div>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

module.exports = Home;
