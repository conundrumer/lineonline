var React = require('react/addons');

//UI Components
var GalleryTile = require('./GalleryTile.jsx');

var TracksSlider = React.createClass({
    render: function() {
        //this.props.tracks
        return (
            <div className='col span_3_of_4'>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile title='Track Title' description='Description 1 description blah blah blah' col='col-first' />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile title='Track Title' description='Description 1 description blah blah blah' col='col-first' />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <GalleryTile title='Track Title' description='Description 1 description blah blah blah' col='col-first' />
                </div>
            </div>
        );
    }
});

module.exports = TracksSlider;
