var Kefir = require('kefir');
var Actions = require('./actions');

function distance(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx*dx + dy*dy);
}
var MIN_LINE_LENGTH = 6;
var ZOOM = {
    STRENGTH: Math.pow(2, 1/(2<<5)),
    MAX: 2<<4,
    MIN: 1/(2<<4)
};
var ERASER_RADIUS = 5;

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

var ToolsMixin = {
    startTool: function(e) {
        this.mouseDown.emit(e);
    },
    // lifecycle methods
    componentWillMount: function() {
        this.mouseDown = Kefir.emitter();
        this.mouseMove = Kefir.fromEvent(window, 'mousemove')
            .map(this.toCoords);
        this.mouseUp = Kefir.fromEvent(window, 'mouseup')
            .map(this.toCoords);
        this.toolStream = this.mouseDown
            .map(this.toCoords);

        this.toolStream.onValue(this.onTool);
    },
    componentWillUnmount: function() {
        this.unsubscribeTool();
        this.toolStream.offValue(this.onTool);
    },
    // tool subscription management
    onTool: function(start) {
        this.state.toolHandler(start, this.mouseMove, this.mouseUp);
    },
    subscribeTool: function(tool) {
        stream = tool.stream.takeUntilBy(this.mouseUp);
        onValue = tool.onValue.bind(this);
        onEnd = tool.onEnd && tool.onEnd.bind(this) || function() {};
        function unsubscribeTool () {
            stream.offValue(onValue);
            stream.offEnd(endTool);
        }
        function endTool() {
            onEnd();
            unsubscribeTool();
        }
        stream.onValue(onValue);
        stream.onEnd(endTool);
        this.unsubscribeTool = unsubscribeTool;
    },
    unsubscribeTool: function(){},
    // util
    toCoords: function(e) {
        e.preventDefault();
        var rect = this.refs.canvas.getDOMNode().getBoundingClientRect();
        return {
            x: e.pageX - rect.left,
            y: e.pageY - rect.top
        };
    },
    toRelativePosition: function(offset) {
        return {
            x: offset.x / this.state.zoom,
            y: offset.y / this.state.zoom
        };
    },
    toAbsolutePosition: function(offset) {
        return {
            x: offset.x / this.state.zoom + this.getLeft(),
            y: offset.y / this.state.zoom + this.getTop()
        };
    },
    // tool definitions
    pan: function(start, moveStream) {
        start = this.toRelativePosition(start);
        var pan = this.state.pan;

        var stream = moveStream
            .map(this.toRelativePosition)
            .map(function(p) {
                return {
                    x: pan.x + (start.x - p.x),
                    y: pan.y + (start.y - p.y)
                };
            });

        this.subscribeTool({
            stream: stream,
            onValue: function(pan) {
                this.setState({ pan: pan });
            }
        });
    },
    zoom: function(start, moveStream) {
        var startPos = this.toAbsolutePosition(start);
        var initPan = this.state.pan;
        var initZoom = this.state.zoom;

        var stream = moveStream
            .map(function(p) {
                var dz = Math.pow(ZOOM.STRENGTH, start.y - p.y);
                return clamp(initZoom * dz, ZOOM.MIN, ZOOM.MAX);
            });

        this.subscribeTool({
            stream: stream,
            onValue: function(zoom) {
                var pan = {
                    x: startPos.x + (initPan.x - startPos.x) * initZoom / zoom,
                    y: startPos.y + (initPan.y - startPos.y) * initZoom / zoom
                };
                this.setState({ pan: pan, zoom: zoom });
            }
        });
    },
    pencil: function(start, moveStream) {
        start = this.toAbsolutePosition(start);
        var setState = this.setState.bind(this);
        setState({ startPos: start });

        var stream = moveStream
            .map(this.toAbsolutePosition)
            .withDefault(start)
            .tap(function(p) {
                setState({ movePos: p });
            })
            .scan(function(prev, next) {
                return (distance(prev, next) > MIN_LINE_LENGTH) ? next : prev;
            })
            .skipDuplicates()
            .tap(function(p) {
                setState({ startPos: p });
            })
            .slidingWindow(2,2);

        this.subscribeTool({
            stream: stream,
            onValue: function (line) {
                Actions.drawLine(this.props.userID, line[0], line[1]);
            },
            onEnd: function () {
                this.setState({ startPos: null, movePos: null });
            }
        });
    },
    line: function(start, moveStream) {
        start = this.toAbsolutePosition(start);
        this.setState({ startPos: start });
        var end = start;

        var stream = moveStream
            .map(this.toAbsolutePosition);

        this.subscribeTool({
            stream: stream,
            onValue: function (p) {
                this.setState({ movePos: p });
                end = p;
            },
            onEnd: function () {
                this.setState({ startPos: null, movePos: null });
                if (distance(start, end) > MIN_LINE_LENGTH / this.state.zoom) {
                    Actions.drawLine(this.props.userID, start, end);
                }
            }
        });
    },
    eraser: function(start, moveStream) {
        Actions.eraseLines(start, ERASER_RADIUS / this.state.zoom);

        var stream = moveStream
            .map(this.toAbsolutePosition)
            .withDefault(start)
            .slidingWindow(2,2);

        this.subscribeTool({
            stream: stream,
            onValue: function (line) {
                Actions.eraseLines(line[1], ERASER_RADIUS / this.state.zoom);
            }
        });
    }
};

module.exports = ToolsMixin;
