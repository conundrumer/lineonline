var React = require('react/addons');
var Reflux = require('reflux');
var Kefir = require('kefir');
var _ = require('underscore');

var Actions = require('./actions');
var ErrorActions = require('../actions-error');
var sceneStore = require('./store');

var Display = require('./Display.jsx');
var Icon = require('../ui/Icon.jsx');

var toolbarStyle = {
    position: 'absolute'
};

var fullSize = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white'
};

var RESIZE_THROTTLE = 200;

var Editor = React.createClass({
    mixins: [
        require('./tools'),
        Reflux.listenTo(sceneStore, 'onSceneChanged')
    ],
    onSceneChanged: function(data, action) {
        if (action == 'add') {
            this.props.onAddLine(data, this.props.isNewTrack);
        } else if (action == 'remove') {
            this.props.onRemoveLine(data, this.props.isNewTrack);
        } else {
            this.setState({ scene: data });
        }

    },
    getInitialState: function() {
        return {
            scene: sceneStore.getDefaultData(),
            width: 0,
            height: 0,
            pan: { x: 20, y: 20 },
            zoom: 2,
            toolHandler: this.pencil,
            startPos: null,
            movePos: null
        };
    },
    componentWillMount: function() {
        this.resizeStream = Kefir.fromEvent(window, 'resize')
            .throttle(RESIZE_THROTTLE)
            .withDefault(0);
    },
    componentDidMount: function() {
        this.resizeStream.onValue(this.onResize);
    },
    componentWillUnmount: function() {
        this.resizeStream.offValue(this.onResize);
    },
    onResize: function() {
        var canvas = this.refs.canvas.getDOMNode();
        console.log('width', canvas.clientWidth);
        console.log('height', canvas.clientHeight);
        this.setState({
            width: canvas.clientWidth,
            height: canvas.clientHeight
        });
    },
    onToolClick: function(tool) {
        return function onClick(e) {
            e.preventDefault();
            this.setState({
                toolHandler: tool
            });
        }.bind(this);
    },
    onClear: function(e) {
        e.preventDefault();

        if (!this.props.isNewTrack ||
            _.keys(this.state.scene.points).length === 0) {
            Actions.newScene();
            this.props.onNewTrack();
        } else {
            ErrorActions.throwError({
                message: 'Unsaved changes. Are you sure you want to start a new track?',
                onConfirm: function() { Actions.newScene(); this.props.onNewTrack(); }.bind(this),
                onCancel: function() { console.log('did nothing'); }.bind(this)
            });
        }

    },
    onToolBarMouseDown: function(e) {
        e.stopPropagation();
    },
    onSaveSetting: function(e) {
        e.preventDefault();
        Actions.saveScene(this.props.userID, this.props.onSaveSetting);
    },
    getWidth: function() {
        return this.state.width / this.state.zoom;
    },
    getHeight: function() {
        return this.state.height / this.state.zoom;
    },
    getLeft: function() {
        return this.state.pan.x - this.getWidth()/2;
    },
    getTop: function() {
        return this.state.pan.y - this.getHeight()/2;
    },
    getPosition: function(offsetX, offsetY) {
        return {
            x: offsetX / this.state.zoom + this.getLeft(),
            y: offsetY / this.state.zoom + this.getTop()
        };
    },
    getViewBox: function () {
        if (!this.state.width || !this.state.height) return [0, 0, 0, 0];
        return [ this.getLeft(), this.getTop(), this.getWidth(), this.getHeight() ];
    },
    render: function() {
        var drawingLine;
        var startPos = this.state.startPos;
        var movePos = this.state.movePos;
        if (startPos && movePos) {
            drawingLine = {
                p1: startPos,
                p2: movePos
            };
        }
        var viewBox = this.getViewBox();
        return (
            <div ref='canvas' onMouseDown={this.startTool} style={fullSize}>
                <Display
                    drawingLine={drawingLine}
                    scene={this.state.scene}
                    viewBox={viewBox}
                />
                <div onMouseDown={this.onToolBarMouseDown} className='toolbar'>
                    <ToolButton onClick={this.onToolClick(this.pencil)} icon='pencil' name='Pencil' />
                    <ToolButton onClick={this.onToolClick(this.line)} icon='minus' name='Line' />
                    <ToolButton onClick={this.onToolClick(this.eraser)} icon='delete' name='Erase' />
                    <ToolButton
                        onClick={this.onSaveSetting}
                        icon={ this.props.isNewTrack ? 'check' : 'cog' }
                        name={ this.props.isNewTrack ? 'Save' : 'Settings' } />
                    <ToolButton onClick={this.onClear} icon='x' name='New' />
                </div>
            </div>
        );
    }
});

var ToolButton = React.createClass({
    render: function() {
        return (
            <button className='btn-toolbar' onClick={this.props.onClick}>
                <Icon class='toolbar-icon' icon={this.props.icon} />
                <span className='toolbar-title'>
                    {this.props.name}
                </span>
            </button>
        );
    }
});

module.exports = Editor;
