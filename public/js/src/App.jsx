var React = require('react');

var names = ["delu", "jing", "what"];

var App = React.createClass({
    render: function() {
        return (
            <div className="login-link">
                {names.map(function(n) {
                    return <Hello name={n} />
                })}
            </div>
        );
    }
});


var Hello = React.createClass({
    render: function() {
        return (
            <div>HELEO { this.props.name }</div>
        );
    }
});

module.exports = App;
