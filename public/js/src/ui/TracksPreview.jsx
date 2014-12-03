var React = require('react/addons');
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var FavoritesStore = require('../stores/favorites');

//UI Components
var GalleryTile = require('./GalleryTile.jsx');

var TracksPreview = React.createClass({
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
        if (this.props.userId) {
            Actions.getFavorites();
            console.log('gettingFavs');
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if ((this.props.userId !== nextProps.userId)
            && nextProps.userId) {
            Actions.getFavorites();
        }
    },
    isInFavorites: function(trackId) {
        // console.log(this.state.data.favorites);
        // console.log(trackId);
        if (this.state.data.favorites) {
            for (var i = 0; i < this.state.data.favorites.length; i++) {
                if (this.state.data.favorites[i].track_id === trackId) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    },
    render: function() {
        var tracksCols = {
            0: [],
            1: [],
            2: []
        };
        this.props.tracks.forEach(function(track, idx) {
            var colIdx = idx % 3;
            tracksCols[colIdx].push(track);
        });
        return (
            <div>
                {this.props.tracks && this.props.tracks.length > 0 ?
                    <div className='section group'>
                        <TracksCol
                            col='col-first'
                            userId={this.props.userId}
                            tracks={tracksCols[0]}
                            extra={this.props.extra}
                            isInFavorites={this.isInFavorites}
                        />
                        <TracksCol
                            col='col-mid'
                            userId={this.props.userId}
                            tracks={tracksCols[1]}
                            extra={this.props.extra}
                            isInFavorites={this.isInFavorites}
                        />
                        <TracksCol
                            col='col-last'
                            userId={this.props.userId}
                            tracks={tracksCols[2]}
                            extra={this.props.extra}
                            isInFavorites={this.isInFavorites}
                        />
                    </div>
                    :
                    <p className='message-panel message-panel-center message-panel-tracks'>
                        No tracks to show.
                    </p>
                }
            </div>
        );
    }
});

var TracksCol = React.createClass({
    render: function() {
        var tracks = this.props.tracks;
        var galleryTiles = this.props.tracks.map(function(track) {
            var trackPreview = '../../images/sample_masthead.png'; //track.preview
            var isInFavorites = this.props.isInFavorites(track.track_id);
            return (
                <GalleryTile
                    key={track.id}
                    userId={this.props.userId}
                    trackId={track.track_id}
                    title={track.title}
                    description={track.description}
                    col={this.props.col}
                    extra={this.props.extra}
                    trackPreview={trackPreview}
                    isInFavorites={isInFavorites}
                />
            );
        }.bind(this));
        return (
            <div className='gallery-col col span_1_of_3'>
               {galleryTiles}
            </div>
        );
    }
});

module.exports = TracksPreview;
