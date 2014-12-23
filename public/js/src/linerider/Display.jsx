var React = require('react/addons');
var _ = require('underscore');

var MIN_LINE_LENGTH = 2<<3; // >> // wow buggy syntax highlighting

var LINE_WIDTH = 2;

function distance(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx*dx + dy*dy);
}
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
                strokeWidth={LINE_WIDTH}
                strokeLinecap='round'
            />
        );
    }
});

function getViewBox(points) {
    console.log('points', points)
    var box = points
    .map(function(p) {
        return p.pos;
    })
    .map(function(p) {
        return [p.x, p.y, p.x, p.y];
    })
    .reduce(function (a, b) {
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
        } else {
            viewBox = this.props.viewBox;
        }
        var drawingLineColor = ( this.props.drawingLine &&
            distance(this.props.drawingLine.p1, this.props.drawingLine.p2) > MIN_LINE_LENGTH
            ) ? 'black' : this.lineriderRed;
        return (
            <svg className='display-svg' viewBox={viewBox}>
                { _.values(scene.lines).map(function(line) {
                    var key = line.id;
                    var pq = line.pq;
                    var p1 = scene.points[pq.p].pos;
                    var p2 = scene.points[pq.q].pos;
                    return <Line key={key} p1={p1} p2={p2} />;
                }.bind(this)) }
                { this.props.drawingLine ?
                    <Line key={-1}
                        p1={this.props.drawingLine.p1}
                        p2={this.props.drawingLine.p2}
                        color={drawingLineColor}
                    /> : null
                }
            </svg>
        );
    }
});

module.exports = Display;
