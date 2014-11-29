var React = require('react/addons');
var Display = require('./Display.jsx');
var Icon = require('../ui/Icon.jsx');

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

        //CHANGE ISMODALHIDDEN TO TRUE
        return {
            scene: initScene,
            editState: EDIT_STATE.PENCIL,
            startPos: null,
            movePos: null,
            isModalHidden: false,
            isCollabFormDisabled: true,
        };
    },
    componentDidMount: function() {
    },
    componentWillUnmount: function() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
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
    handleAnyClick: function(event) {
        if (!this.state.modalHidden) {
            this.setState({
                isModalHidden: true
            });
        }
        window.removeEventListener('click', this.handleAnyClick);
    },
    handleSaveToolClick: function(event) {
        if (this.state.modalHidden) {
            this.setState({
                isModalHidden: false
            });
            event.stopPropagation();
            window.addEventListener('click', this.handleAnyClick);
        }
    },
    handleSaveTrack: function(e) {
        e.preventDefault();
        //show modal, trigger save on clicking save
        // this.onSave(e);
        console.log('handling saving track');
    },
    handleSaveCollab: function(e) {
        e.preventDefault();
        console.log('handling saving collab info for track');
    },
    onSave: function(e) {
        e.preventDefault();
        var data = {
            scene: this.state.scene
        };
        // if (this.props.isBlank) {
        //     data = {
        //         scene: this.state.scene,
        //         title: this.props.track.title
        //         description: this.props.track.description,
        //         collaborators: this.props.track.collaborators,
        //         invitees: this.props.track.invitees,
        //         tags: this.props.track.tags,
        //         preview: this.props.track.preview
        //     };
        // } else {
        //     data = {
        //         track_id: this.props.track.track_id,
        //         scene: this.state.scene,
        //         title: this.props.track.title
        //         description: this.props.track.description,
        //         collaborators: this.props.track.collaborators,
        //         invitees: this.props.track.invitees,
        //         tags: this.props.track.tags,
        //         preview: this.props.track.preview
        //     };
        // }
        this.props.onSave(data);
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
                    isCollabFormDisabled={this.state.isCollabFormDisabled}
                    handleSaveTrack={this.handleSaveTrack}
                    handleSaveCollab={this.handleSaveCollab}
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
                        <button className='btn-toolbar' onClick={this.handleSave}>
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
            track_form_title: '',
            track_form_description: '',
            track_form_tags: []
        };
    },
    handleChange: function(inputName) {
        return function (event) {
            // console.log(event.target.value);
            var inputValueArr = event.target.value.split(',');
            inputValueArr.forEach(function(el, idx, arr) {
                arr[idx] = el.trim();
                console.log(arr[idx]);
            });
            inputValueArr = inputValueArr.filter(function(el) {
                return el !== '';
            });
            console.log(inputValueArr);
            var state = {};
            state[inputName] = inputValueArr;
            this.setState(state);
        }.bind(this);
    },
    render: function() {
        return (
            <div className={'save-modal' + (this.props.isModalHidden ? ' hide' : '')}>
                <div>
                    <Icon class='x-icon' icon='circle-x' />
                </div>
                <form className='form-editor form-editor-track'>
                    <div className='field'>
                        <label for='title'>
                            Title:
                        </label>
                        <input ref='inputTitle' name='title' type='text' />
                    </div>
                    <div className='field'>
                        <label for='description'>
                            Description:
                        </label>
                        <textarea ref='inputDescription' name='description' />
                    </div>
                    <div className='field'>
                        <label for='tags'>
                            Tags: <span className='note'>(separated by a comma)</span>
                        </label>
                        <input ref='inputTags' name='tags' type='text' onChange={this.handleChange('track_form_tags')} />
                    </div>
                </form>
                <form className={'form-editor form-editor-collab' + (this.props.isCollabFormDisabled ? ' form-disabled' : '')}>
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
                        <input ref='inputInvitees' name='invitees' type='text' />
                        <button className='btn-submit' type='submit' onClick={this.props.handleSaveCollab}>
                            Invite
                        </button>
                    </div>
                </form>
                <button className='btn-submit btn-save-modal' type='submit' onClick={this.props.handleSaveTrack}>
                    Save
                </button>
            </div>
        );
    }
});


module.exports = Editor;
