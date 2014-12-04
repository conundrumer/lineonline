var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var GalleryStore = require('../stores/gallery');

//UI Components
var Icon = require('./Icon.jsx');
var TracksCol = require('./TracksCol.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var Gallery = React.createClass({
    mixins: [
        Reflux.listenTo(GalleryStore, 'onDataChanged')
    ],
    defaultTrackNum: 3,
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });

    },
    getInitialState: function() {
        return {
            data: GalleryStore.getDefaultData(),
        }
    },
    componentWillMount: function() {
        var trackNum = this.props.trackNum ? this.props.trackNum : this.defaultTrackNum;
        Actions.getNewTracks(trackNum);
        Actions.getHotTracks(trackNum);
        Actions.getTopTracks(trackNum);
    },
    componentWillReceiveProps: function(nextProps) {
        var trackNum = this.props.trackNum ? this.props.trackNum : this.defaultTrackNum;
        Actions.getNewTracks(trackNum);
        Actions.getHotTracks(trackNum);
        Actions.getTopTracks(trackNum);
    },
    render: function() {
        // console.log(this.props.currentUser);
        console.log(this.state.data.newTracks);
        console.log(this.state.data.hotTracks);
        console.log(this.state.data.topTracks);

        var userId = this.props.currentUser ? this.props.currentUser.user_id : null;
        console.log(userId);
        return (
            <div>
                {this.props.isPreview ?
                    <GalleryPreview
                        isPreview={this.props.isPreview}
                        userId={userId}
                        hotTracks={this.state.data.hotTracks}
                        topTracks={this.state.data.topTracks}
                        newTracks={this.state.data.newTracks}
                    />
                    :
                    <div className='main-content'>
                        <PanelPadded isGallery={true}>
                            <SearchBar />
                            <div className='section group'>
                                <GalleryPreview
                                    isPreview={false}
                                    userId={userId}
                                    hotTracks={this.state.data.hotTracks}
                                    topTracks={this.state.data.topTracks}
                                    newTracks={this.state.data.newTracks}
                                />
                            </div>
                        </PanelPadded>
                        <Footer />
                    </div>
                }
            </div>
        );
    }
});

var GalleryPreview = React.createClass({
    render: function() {
        return (
            <div className='section group'>
                {this.props.hotTracks && this.props.hotTracks.length > 0 ?
                    <TracksCol
                        headerTitle='Hot'
                        headerIcon='pulse'
                        col='col-first'
                        userId={this.props.userId}
                        tracks={this.props.hotTracks}
                    />
                    : null
                }
                {this.props.topTracks && this.props.topTracks.length > 0 ?
                    <TracksCol
                        headerTitle='Top'
                        headerIcon='star'
                        col='col-mid'
                        userId={this.props.userId}
                        tracks={this.props.topTracks}
                    />
                    : null
                }
                {this.props.newTracks && this.props.newTracks.length > 0 ?
                    <TracksCol
                        headerTitle='New'
                        headerIcon='clock'
                        col='col-last'
                        userId={this.props.userId}
                        tracks={this.props.newTracks}
                    />
                    : null
                }
                {this.props.isPreview ?
                    <Link to='gallery'>
                        <button className='btn btn-see-more'>
                            See More
                        </button>
                    </Link>
                    : null
                }
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
