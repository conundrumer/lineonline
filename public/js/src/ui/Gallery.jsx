var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
// var GalleryStore = require('../stores/gallery');

//UI Components
var Icon = require('./Icon.jsx');
var GalleryPreview = require('./GalleryPreview.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Gallery = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <PanelPadded isGallery={true}>
                    <SearchBar />
                    <div className='section group'>
                        <GalleryPreview />
                    </div>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

var SearchBar = React.createClass({
    render: function() {
        return (
            <div className='section group'>
                <form className='form-search-gallery' method='get' action='/search-gallery'>
                    <div className='section group'>
                        <div className='col span_10_of_12 search-bar'>
                            <input className='input-search' name='search-keyword' type='text' placeholder='Search for tracks...' />
                            <Icon class='search-icon' icon='magnifying-glass' />
                        </div>
                        <div className='col span_2_of_12'>
                            <button className='btn-search' type='submit'>
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});


module.exports = Gallery;
