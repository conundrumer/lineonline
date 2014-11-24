var React = require('react/addons');
var _ = require('underscore');

var fullSize = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
};

var Line = React.createClass({
    getDefaultProps: function() {
        return {
            color: 'black'
        };
    },
    render: function() {
        return (
            <line
                x1={this.props.p1.x}
                y1={this.props.p1.y}
                x2={this.props.p2.x}
                y2={this.props.p2.y}
                stroke={this.props.color}
                strokeWidth='4'
                strokeLinecap='round'
            />
        );
    }
});

var Display = React.createClass({
    getInitialState: function() {
        return {
            width: 0,
            height: 0
        };
    },
    onResize: function(e) {
        var node = this.refs.container.getDOMNode();
        this.setState({
            width: node.clientWidth,
            height: node.clientHeight
        });
    },
    componentDidMount: function() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.onResize);
    },
    render: function() {
        var scene = this.props.scene;
        return (
            <div ref='container' style={fullSize}>
                <svg width={this.state.width} height={this.state.height}>
                    { _.pairs(scene.lines).map(function(pair) {
                        var key = pair[0];
                        var points = pair[1];
                        var p1 = scene.points[points.p1];
                        var p2 = scene.points[points.p2];
                        return <Line key={key} p1={p1} p2={p2} />;
                    }.bind(this)) }
                    { this.props.drawingLine ?
                        <Line key={-1}
                            p1={this.props.drawingLine.p1}
                            p2={this.props.drawingLine.p2}
                            color='red'
                        /> : null
                    }
                </svg>
            </div>
        );
    }
});

module.exports = Display;
