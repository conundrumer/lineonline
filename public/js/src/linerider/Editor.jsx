var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('underscore');

var Actions = require('./actions');
var ErrorActions = require('../actions-error');
var sceneStore = require('./store');

var Display = require('./Display.jsx');
var Icon = require('../ui/Icon.jsx');

var toolbarStyle = {
    position: 'absolute',

};

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
            toolHandler: this.pencil,
            startPos: null,
            movePos: null
        };
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
        return (
            <div ref='canvas' onMouseDown={this.startTool}>
                <Display
                    drawingLine={drawingLine}
                    scene={this.state.scene}
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
