var React = require('react/addons');

var Icon = React.createClass({
    render: function() {
        return (
            <span
                className={this.props.class + ' oi'}
                data-glyph={this.props.icon}
                title={this.props.icon}
                aria-hidden='true'>
            </span>
        );
    }
});

module.exports = Icon;
