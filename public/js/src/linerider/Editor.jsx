var React = require('react/addons');
var Display = require('./Display.jsx');
var Icon = require('../ui/Icon.jsx');
var _ = require('underscore');

var EDIT_STATE = {
    LINE: 1,
    ERASE: 2,
    PENCIL: 3
};

var MIN_LINE_LENGTH = 10;
var ERASER_RADIUS = 5;

var EMPTY_SCENE = {
    next_point_id: 0,
    next_line_id: 0,
    points:{},
    lines:{}
};

function toLineSegments(scene) {
    return Object.keys(scene.lines).map(function(id) {
        return {
            p1: scene.points[scene.lines[id].p1],
            p2: scene.points[scene.lines[id].p2]
        };
    });
}

var toolbarStyle = {
    position: 'absolute',

};

// ugh i neeed to make a vector class
function distance(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function rotate(p, a) {
    return {
        x: Math.cos(a)*p.x - Math.sin(a)*p.y,
        y: Math.sin(a)*p.x + Math.cos(a)*p.y
    };
}

// gonna use trig functions because i do't want to deal w/ linear algebra
function lineSegmentDistance(p, line) {
    // make everything relative to p, ie move things so p is at (0,0)
    var p1 = {
        x: line.p1.x - p.x,
        y: line.p1.y - p.y
    };
    var p2 = {
        x: line.p2.x - p.x,
        y: line.p2.y - p.y
    };
    // orient line to be perpedicular to x
    var lineAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    p1 = rotate(p1, -lineAngle);
    p2 = rotate(p2, -lineAngle);
    if ((p1.x < 0 && 0 < p2.x) || (p2.x < 0 && 0 < p1.x)) {
        return Math.abs(p1.y);
    } else {
        return Math.min(length(p1), length(p2));
    }
}

var Editor = React.createClass({
    navbarOffset: 70,
    getInitialState: function() {
        // setting init state w/ props is generally an anti-pattern
        // but there is no synchronization needed atm
        var initScene = this.props.initScene;
        var initTrack = this.props.initTrack;

        return {
            scene: initScene,
            track: initTrack,
            editState: EDIT_STATE.PENCIL,
            startPos: null,
            movePos: null,
            isModalHidden: true
        };
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.state.scene !== nextProps.initScene) {
            this.setState({
                scene: nextProps.initScene
            });
        }

        if (this.state.track !== nextProps.initTrack) {
            this.setState({
                track: nextProps.initTrack
            });
        }
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
        this.setState({
            scene: {
                next_point_id: 0,
                next_line_id: 0,
                points:{},
                lines:{}
            }
        });
    },
    onCloseModal: function(event) {
        if (!this.state.isModalHidden) {
            this.setState({
                isModalHidden: true
            });
        }
    },
    onOpenModal: function(event) {
        if (this.state.isModalHidden) {
            this.setState({
                isModalHidden: false
            });
        }
    },
    onInvite: function(e) {
        console.log('inviting');
        // Actions.checkUser
    },
    onSave: function(formData) {
        this.setState({
            track: _.extend(this.state.track, formData, { scene : this.state.scene })
        })
        this.props.handleSave(this.state.track);
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
            case EDIT_STATE.ERASE:
                this.removeLines(startPos);
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
            case EDIT_STATE.PENCIL:
                if (distance(startPos, movePos) > MIN_LINE_LENGTH) {
                    this.addLine(startPos, movePos);
                    this.setState({ startPos: movePos });
                }
                break;
            case EDIT_STATE.ERASE:
                this.removeLines(movePos);
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
            case EDIT_STATE.LINE:
                if (distance(startPos, endPos) > MIN_LINE_LENGTH) {
                    this.addLine(startPos, endPos);
                }
                break;
        }
        this.setState({ startPos: null, movePos: null });
    },
    onToolBarMouseDown: function(e) {
        e.stopPropagation();
    },
    // editing functions
    // no snapping but stuff will get more complicated when that's implemented
    addLine: function (p1, p2) {
        var scene = this.state.scene;
        var pointID = scene.next_point_id;
        var lineID = scene.next_line_id;
        // no correction for pan/zoom
        scene.points[pointID] = p1;
        scene.points[pointID+1] = p2;
        scene.lines[lineID] = { p1: pointID, p2: pointID+1 };
        scene.next_point_id = pointID + 2;
        scene.next_line_id = lineID + 1;
        this.setState({
            scene: scene
        });
        // this.props.onAddPoint({id: pointID, x: p1.x, y: p1.y});
        // this.props.onAddPoint({id: pointID+1, x: p2.x, y: p2.y});
        // this.props.onAddLine({id: lineID, p1: pointID, p2: pointID+1});
    },
    removeLines: function (pos) {
        var scene = this.state.scene;
        Object.keys(scene.lines).filter(function(id) {
            var line = scene.lines[id];
            var p1 = scene.points[line.p1];
            var p2 = scene.points[line.p2];
            // console.log(lineSegmentDistance(pos, {p1: p1, p2: p2}))
            return lineSegmentDistance(pos, {p1: p1, p2: p2}) < ERASER_RADIUS;
        }).forEach(function(id) {
            var line = scene.lines[id];
            delete scene.points[line.p1];
            delete scene.points[line.p2];
            delete scene.lines[id];
            // this.props.onRemovePoint({id: parseInt(line.p1)});
            // this.props.onRemovePoint({id: parseInt(line.p2)});
            // this.props.onRemoveLine({id: parseInt(id)});
        }.bind(this));
        this.setState({ scene: scene });
    },
    render: function() {
        var drawingLine;
        var startPos = this.state.startPos;
        var movePos = this.state.movePos;
        switch (this.state.editState) {
            case EDIT_STATE.LINE:
            case EDIT_STATE.PENCIL:
                if (startPos && movePos) {
                    drawingLine = {
                        p1: startPos,
                        p2: movePos
                    };
                }
                break;
        }
        return (
            <div>
                <SaveModal
                    isModalHidden={this.state.isModalHidden}
                    onInvite={this.onInvite}
                    onSave={this.onSave}
                    onCloseModal={this.onCloseModal}
                    track={this.state.track}
                />
                <div onMouseDown={this.onMouseDown}>
                    <Display
                        drawingLine={drawingLine}
                        lines={toLineSegments(this.state.scene)}
                    />
                    <div onMouseDown={this.onToolBarMouseDown} className='toolbar'>
                        <button className='btn-toolbar' onClick={this.onToolClick(EDIT_STATE.PENCIL)}>
                            <Icon class='toolbar-icon' icon='pencil' />
                            <span className='toolbar-title'>
                                Pencil
                            </span>
                        </button>
                        <button className='btn-toolbar' onClick={this.onToolClick(EDIT_STATE.LINE)}>
                            <Icon class='toolbar-icon' icon='minus' />
                            <span className='toolbar-title'>
                                Line
                            </span>
                        </button>
                        <button className='btn-toolbar' onClick={this.onToolClick(EDIT_STATE.ERASE)}>
                            <Icon class='toolbar-icon' icon='delete' />
                            <span className='toolbar-title'>
                                Erase
                            </span>
                        </button>
                        <button className='btn-toolbar' onClick={this.onOpenModal}>
                            <Icon class='toolbar-icon' icon='check' />
                            <span className='toolbar-title'>
                                Save
                            </span>
                        </button>
                        <button className='btn-toolbar' onClick={this.onClear}>
                            <Icon class='toolbar-icon' icon='x' />
                            <span className='toolbar-title'>
                                Clear
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
});

var SaveModal = React.createClass({
    getInitialState: function() {
        return {
            track: this.props.track
        };
    },
    onTitleChange: function(event) {
        this.setState({
            track: _.extend(this.state.track, { title: event.target.value })
        });
    },
    onDescriptionChange: function(event) {
        this.setState({
            track: _.extend(this.state.track, { description: event.target.value })
        });
    },
    onTagsChange: function(event) {
        this.setState({
            track: _.extend(this.state.track, { tags: event.target.value.split(',') })
        });
    },
    processTags: function(value) {
        var inputValueArr = value.split(',');
        inputValueArr.forEach(function(el, idx, arr) {
            arr[idx] = el.trim();
        });
        inputValueArr = inputValueArr.filter(function(el) {
            return el !== '';
        });
        return inputValueArr;
    },
    handleFormSubmit: function(e) {
        e.preventDefault();

        var trackData = {
            title: this.refs.trackTitle.getDOMNode().value.trim(),
            description: this.refs.trackDescription.getDOMNode().value.trim(),
            tags: this.processTags(this.refs.trackTags.getDOMNode().value.trim()),
            invitees: this.state.track.invitees,
            collaborators: this.state.track.collaborators
        };

        this.props.onSave(trackData);
    },
    handleInvite: function(e) {
        e.preventDefault();
        var username = this.refs.inviteeUsername.getDOMNode().value.trim();
        // Actions.getUserFromUsername();

        // this.props.inviteeUsernames.push(username);

        // this.props.onInvite(this.props.collaboratorU, invitees);
    },
    handleDeleteCollaborator: function(e) {

    },
    handleDeleteInvitee: function(e) {

    },
    componentWillMount: function() {
        this.setState({
            track: this.props.track
        });
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.state.track !== nextProps.track) {
            this.setState({
                track: nextProps.track
            });
        }
    },
    render: function() {
        return (
            <div className={'save-modal' + (this.props.isModalHidden ? ' hide' : '')}>
                <div onClick={this.props.onCloseModal}>
                    <Icon class='x-icon x-icon-dark' icon='circle-x' />
                </div>
                <form ref='trackForm' className='form-editor form-editor-track'>
                    <div className='field'>
                        <label for='title'>
                            Title:
                        </label>
                        <input
                            ref='trackTitle'
                            name='title'
                            type='text'
                            value={this.state.track ? this.state.track.title : ''}
                            onChange={this.onTitleChange}
                        />
                    </div>
                    <div className='field'>
                        <label for='description'>
                            Description:
                        </label>
                        <textarea
                            ref='trackDescription'
                            name='description'
                            value={this.state.track ? this.state.track.description : ''}
                            onChange={this.onDescriptionChange}
                        />
                    </div>
                    <div className='field'>
                        <label for='tags'>
                            Tags: <span className='note'>(separated by a comma)</span>
                        </label>
                        <input
                            ref='trackTags'
                            name='tags'
                            type='text'
                            value={this.state.track ? (this.state.track.tags) : ''}
                            onChange={this.onTagsChange}
                        />
                    </div>
                </form>
                <form ref='collabForm' className='form-editor form-editor-collab'>
                    <div className='field'>
                        <h3>
                            Collaborators:
                        </h3>
                        <div className='collab-preview collab-preview-collaborators'>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                        </div>
                    </div>
                    <div className='field'>
                        <label for='invitees'>
                            Invitees:
                        </label>
                        <div className='collab-preview collab-preview-invitees'>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                            <div className='user-img'>
                                <img src='../../images/sample_profile.png' />
                            </div>
                        </div>
                        <input ref='inviteeUsername' name='invitees' type='text' />
                        <button className='btn-submit' type='submit' onClick={this.handleInvite}>
                            Invite
                        </button>
                    </div>
                </form>
                <button className='btn-submit btn-save-modal' type='submit' onClick={this.handleFormSubmit}>
                    Save
                </button>
            </div>
        );
    }
});


module.exports = Editor;
