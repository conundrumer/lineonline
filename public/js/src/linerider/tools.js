var Kefir = require('kefir');
var Actions = require('./actions');

function distance(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx*dx + dy*dy);
}
var MIN_LINE_LENGTH = 10;

var ToolsMixin = {
    startTool: function(e) {
        this.mouseDown.emit(e);
    },
    // lifecycle methods
    componentWillMount: function() {
        this.mouseDown = Kefir.emitter();
        this.mouseMove = Kefir.fromEvent(window, 'mousemove')
            .map(this.mouseCoords);
        this.mouseUp = Kefir.fromEvent(window, 'mouseup')
            .map(this.mouseCoords);
        this.toolStream = this.mouseDown
            .map(this.mouseCoords);

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
    mouseCoords: function(e) {
        e.preventDefault();
        var rect = this.refs.canvas.getDOMNode().getBoundingClientRect();
        return this.getPosition(e.pageX - rect.left, e.pageY - rect.top);
    },
    // tool definitions
    pencil: function(start, moveStream) {
        var setState = this.setState.bind(this);
        setState({ startPos: start });

        var stream = moveStream
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
        this.setState({ startPos: start });
        var end = start;

        this.subscribeTool({
            stream: moveStream,
            onValue: function (p) {
                this.setState({ movePos: p });
                end = p;
            },
            onEnd: function () {
                this.setState({ startPos: null, movePos: null });
                if (distance(start, end) > MIN_LINE_LENGTH) {
                    Actions.drawLine(this.props.userID, start, end);
                }
            }
        });
    },
    eraser: function(start, moveStream) {
        Actions.eraseLines(start);

        var stream = moveStream
            .withDefault(start)
            .slidingWindow(2,2);

        this.subscribeTool({
            stream: stream,
            onValue: function (line) {
                Actions.eraseLines(line[1]);
            }
        });
    }
};

module.exports = ToolsMixin;
