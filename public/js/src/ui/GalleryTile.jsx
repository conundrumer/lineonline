var React = require('react/addons');

//UI Components
var GalleryRow = require('./GalleryRow.jsx');
var Icon = require('./Icon.jsx');

var GalleryTile = React.createClass({
    render: function() {
        return (
            <GalleryRow>
                <article className={'tile ' + this.props.col}>
                    <div className='preview'>
                        <Icon class='preview-icon' icon='fullscreen-enter' />
                    </div>
                    <div className='info'>
                        <h3>
                            {this.props.title}
                        </h3>
                        <p>
                            {this.props.description}
                        </p>
                    </div>
                </article>
            </GalleryRow>
        );
    }
});

module.exports = GalleryTile;
