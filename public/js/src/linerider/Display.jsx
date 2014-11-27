var React = require('react/addons');

var fullSize = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'red'
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
                x1={this.props.line.p1.x}
                y1={this.props.line.p1.y}
                x2={this.props.line.p2.x}
                y2={this.props.line.p2.y}
                stroke={this.props.color}
                strokeWidth='4'
                strokeLinecap='round'
            />
        );
    }
});

var Display = React.createClass({
    lineriderRed: '#D62525',
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
        return (
            <div ref='container' className='display'>
                <svg className='display-svg'>
                    {this.props.lines.map(function(line) {
                        return <Line line={line} />;
                    })}
                    { this.props.drawingLine ?
                        <Line line={this.props.drawingLine} color={this.lineriderRed} /> :
                        null
                    }
                </svg>
            </div>
        );
    }
});

module.exports = Display;
