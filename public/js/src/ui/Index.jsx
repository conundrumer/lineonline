var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
// var IndexStore = require('../stores/index');

//UI Components
var GalleryPreview = require('./GalleryPreview.jsx');
var Panel = require('./Panel.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var ScrollDivider = require('./ScrollDivider.jsx');
var Footer = require('./Footer.jsx');

var Index = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Panel isMasthead={true} id='masthead-panel' />
                <ScrollDivider link='#editor-panel' />
                <Link to={'editor'}>
                    <Panel isEditor={true} id='editor-panel' />
                </Link>
                <ScrollDivider link='#gallery-panel' />
                <PanelPadded isGallery={true} id='gallery-panel'>
                    <GalleryPreview />
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

module.exports = Index;
