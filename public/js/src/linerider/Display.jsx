var React = require('react/addons');
var _ = require('underscore');

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

function getViewBox(points) {
    var box = points.map(function(p) {
        return [p.x, p.y, p.x, p.y];
    }).reduce(function (a, b) {
        return [
            Math.min(a[0], b[0]),
            Math.min(a[1], b[1]),
            Math.max(a[2], b[2]),
            Math.max(a[3], b[3]),
        ];
    }, [
        Number.MAX_VALUE,
        Number.MAX_VALUE,
        Number.MIN_VALUE,
        Number.MIN_VALUE
    ]);
    return [
        box[0], // top
        box[1], // left
        box[2] - box[0], // width
        box[3] - box[1] // height
    ];
}

var Display = React.createClass({
    lineriderRed: '#D62525',
    render: function() {
        var scene = this.props.scene;
        var viewBox;
        var points = _.values(scene.points);
        if (this.props.preview && points.length > 0) {
            viewBox = getViewBox(points).join(' ');
        }
        return (
            <svg className='display-svg' viewBox={viewBox}>
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
                        color={this.lineriderRed}
                    /> : null
                }
            </svg>
        );
    }
});

module.exports = Display;
