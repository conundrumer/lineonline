var React = require('react/addons');
var Reflux = require('reflux');

var Actions = require('./actions');
var ErrorActions = require('../actions-error');
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
                    Actions.drawLine(this.props.userID, startPos, movePos);
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
                    Actions.drawLine(this.props.userID, startPos, endPos);
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
        Actions.saveScene(this.props.userID, this.props.onSaveSetting);
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
