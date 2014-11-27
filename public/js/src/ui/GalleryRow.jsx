var React = require('react/addons');

var GalleryRow = React.createClass({
    render: function() {
        return (
            <div className='gallery-row section group'>
                {this.props.children}
            </div>
        );
    }
});

module.exports = GalleryRow;
