var React = require('react/addons');

//UI Components
var Tile = require('./Tile.jsx');

var TracksSlider = React.createClass({
    render: function() {
        //this.props.tracks
        return (
            <div className='col span_3_of_4'>
                <div className='gallery-col col span_1_of_3'>
                    <Tile
                        title='Track Title'
                        description='Description 1 description blah blah blah'
                        col='col-first'
                        userId={this.props.userId}
                    />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <Tile
                        title='Track Title'
                        description='Description 1 description blah blah blah'
                        col='col-first'
                        userId={this.props.userId}
                    />
                </div>
                <div className='gallery-col col span_1_of_3'>
                    <Tile
                        title='Track Title'
                        description='Description 1 description blah blah blah'
                        col='col-first'
                        userId={this.props.userId}
                    />
                </div>
            </div>

        );
    }
});

module.exports = TracksSlider;
