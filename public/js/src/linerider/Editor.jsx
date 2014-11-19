var React = require('react/addons');
var Display = require('./Display.jsx');
var EDIT_STATE = {
    DRAW: 1,
    ERASE: 2
};

// var EMPTY_TRACK = {
//     points: {},
//     lines: {}
// };

var EMPTY_SCENE = {
    points: {
        0: {
            x: 100,
            y: 100
        },
        1: {
            x: 100,
            y: 250
        },
        2: {
            x: 200,
            y: 100
        },
        3: {
            x: 200,
            y: 250
        },
        4: {
            x: 100,
            y: 175
        },
        5: {
            x: 200,
            y: 175
        },
        6: {
            x: 300,
            y: 150
        },
        7: {
            x: 300,
            y: 250
        }
    },
    lines: {
        0: {
            p1: 0,
            p2: 1
        },
        1: {
            p1: 2,
            p2: 3
        },
        2: {
            p1: 4,
            p2: 5
        },
        3: {
            p1: 6,
            p2: 7
        }
    }
};

function toLineSegments(scene) {
    return Object.keys(scene.lines).map(function(id) {
        return {
            p1: scene.points[scene.lines[id].p1],
            p2: scene.points[scene.lines[id].p2]
        };
    });
}

var DEFAULT_HANDLER = console.log;

var Editor = React.createClass({
    getDefaultProps: function() {
        return {
            initScene: EMPTY_SCENE,
            onSaveTrack: DEFAULT_HANDLER,
            onAddLine: DEFAULT_HANDLER,
            onRemoveLine: DEFAULT_HANDLER
        };
    },
    getInitialState: function() {
        return {
            // setting init state w/ props is generally an anti-pattern
            // but there is no synchronization needed atm
            scene: this.props.initScene,
            editState: EDIT_STATE.DRAW
        };
    },
    render: function() {
        return (
            <div>
                <Display
                    lines={toLineSegments(this.state.scene)}
                />
            </div>
        );
    }
});


module.exports = Editor;
