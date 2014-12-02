var React = require('react/addons');
var Reflux = require('reflux');

var Actions = require('./actions');
var sceneStore = require('./store');

var Display = require('./Display.jsx');
var Icon = require('../ui/Icon.jsx');
var _ = require('underscore');

var TOOL = {
    LINE: 1,
    ERASE: 2,
    PENCIL: 3
};

var toolbarStyle = {
    position: 'absolute',

};

function distance(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx*dx + dy*dy);
}

var MIN_LINE_LENGTH = 10;

var Editor = React.createClass({
    navbarOffset: 70,
    mixins: [
        Reflux.listenTo(sceneStore, 'onSceneChanged')
    ],
    onSceneChanged: function(scene, action) {
        this.setState({ scene: scene });
        // do something with action
    },
    getInitialState: function() {
        return {
            scene: sceneStore.getDefaultData(),
            editState: TOOL.PENCIL,
            startPos: null,
            movePos: null
        };
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    },
    componentWillReceiveProps: function(nextProps) {
    },
    // mouse handlers
    onToolClick: function(editState) {
        return function onClick(e) {
            e.preventDefault();
            this.setState({
                editState: editState
            });
        }.bind(this);
    },
    onClear: function(e) {
        e.preventDefault();
        Actions.newScene();
    },
    // not sure how reliable it is in getting the right position
    // will refactor to use RxJS when editing gets more complex
    onMouseDown: function(e) {
        e.preventDefault();
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        var startPos = {
            x: e.pageX,
            y: e.pageY - this.navbarOffset
        };
        switch (this.state.editState) {
            case TOOL.ERASE:
                Actions.eraseLines(startPos);
                break;
        }
        this.setState({ startPos: startPos });
    },
    onMouseMove: function(e) {
        e.preventDefault();
        var startPos = this.state.startPos;
        var movePos = {
            x: e.pageX,
            y: e.pageY - this.navbarOffset
        };
        switch (this.state.editState) {
            case TOOL.PENCIL:
                if (distance(startPos, movePos) > MIN_LINE_LENGTH) {
                    Actions.drawLine(startPos, movePos);
                    this.setState({ startPos: movePos });
                }
                break;
            case TOOL.ERASE:
                Actions.eraseLines(movePos);
                break;
        }
        this.setState({ movePos: movePos });
    },
    onMouseUp: function(e) {
        e.preventDefault();
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        var startPos = this.state.startPos;
        var endPos = {
            x: e.pageX,
            y: e.pageY - this.navbarOffset
        };
        switch (this.state.editState) {
            case TOOL.LINE:
                if (distance(startPos, endPos) > MIN_LINE_LENGTH) {
                    Actions.drawLine(startPos, endPos);
                }
                break;
        }
        this.setState({ startPos: null, movePos: null });
    },
    onToolBarMouseDown: function(e) {
        e.stopPropagation();
    },
    onSaveSetting: function(e) {
        e.preventDefault();
        this.props.onOpenModal(this.state.scene);
    },
    render: function() {
        var drawingLine;
        var startPos = this.state.startPos;
        var movePos = this.state.movePos;
        switch (this.state.editState) {
            case TOOL.LINE:
            case TOOL.PENCIL:
                if (startPos && movePos) {
                    drawingLine = {
                        p1: startPos,
                        p2: movePos
                    };
                }
                break;
        }
        return (
            <div onMouseDown={this.onMouseDown}>
                <Display
                    drawingLine={drawingLine}
                    scene={this.state.scene}
                />
                <div onMouseDown={this.onToolBarMouseDown} className='toolbar'>
                    <ToolButton onClick={this.onToolClick(TOOL.PENCIL)} icon='pencil' name='Pencil' />
                    <ToolButton onClick={this.onToolClick(TOOL.LINE)} icon='minus' name='Line' />
                    <ToolButton onClick={this.onToolClick(TOOL.ERASE)} icon='delete' name='Erase' />
                    <ToolButton onClick={this.onSaveSetting} icon='check'
                        name={ this.props.isNewTrack ? 'Save' : 'Settings' } />
                    <ToolButton onClick={this.onClear} icon='x' name='Clear' />
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
})

module.exports = Editor;
