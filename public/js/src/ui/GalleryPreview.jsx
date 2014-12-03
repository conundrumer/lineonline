var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

//UI Components
var Icon = require('./Icon.jsx');
var GalleryRow = require('./GalleryRow.jsx');
var GalleryTile = require('./GalleryTile.jsx');

var GalleryPreview = React.createClass({
    render: function() {
        return (
            <div className='section group'>
                <GalleryCol headerTitle='Hot' headerIcon='pulse' col='col-first' />
                <GalleryCol headerTitle='Top' headerIcon='star' col='col-mid' />
                <GalleryCol headerTitle='New' headerIcon='clock' col='col-last' />
                <Link to='gallery'>
                    <button className='btn btn-see-more'>
                        See More
                    </button>
                </Link>
            </div>
        );
    }
});

var GalleryCol = React.createClass({
    render: function() {
        var trackPreview = '../../images/sample_masthead.png'; //track.preview
        return (
            <div className='gallery-col col span_1_of_3'>
                <GalleryHeader title={this.props.headerTitle} icon={this.props.headerIcon} />
                <GalleryTile
                    trackPreview={trackPreview}
                    title='Track Title'
                    description='Description 1 description blah blah blah'
                    col={this.props.col}
                />
                <GalleryTile
                    trackPreview={trackPreview}
                    title='Track Title'
                    description='Description 2 description blah blah blah'
                    col={this.props.col}
                />
            </div>
        );
    }
});

var GalleryHeader = React.createClass({
    render: function() {
        return (
            <GalleryRow>
                <h2 className='header-col'>
                    <Icon class='header-icon' icon={this.props.icon} />
                    <span className='header-title'>
                        {this.props.title}
                    </span>
                </h2>
            </GalleryRow>
        );
    }
});

module.exports = GalleryPreview;
