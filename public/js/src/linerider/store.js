var Reflux = require('reflux');
var _ = require('underscore');
var EditorActions = require('./actions');
var ERASER_RADIUS = 5;

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

// subject to change
var ENTITY = {
    POINT: 0,
    LINE: 1
};

function makePoint(id, p) {
    return {
        type: ENTITY.POINT,
        id: id,
        x: p.x,
        y: p.y
    };
}
function makeLine(id, p1, p2) {
    return {
        type: ENTITY.LINE,
        id: id,
        p1: p1,
        p2: p2
    };
}
function lineData(p1ID, p2ID, line_id, p1, p2) {
    return [
        makePoint(p1ID, p1),
        makePoint(p2ID, p2),
        makeLine(line_id, p1ID, p2ID),
    ];
}

function getMaxID(hashmap) {
    return _.keys(hashmap).map(function(id) {
        return parseInt(id.split('_')[1]);
    }).reduce(function(a,b){return Math.max(a,b);}, 0) + 1;
}

var SceneStore = Reflux.createStore({
    listenables: [EditorActions],
    getDefaultData: function() {
        this.scene = {
            points:{},
            lines:{}
        };
        this.next_point_id = 0;
        this.next_line_id = 0;
        return this.scene;
    },
    onNewScene: function () {
        this.trigger(this.getDefaultData(), 'new scene');
    },
    onLoadScene: function (scene) {
        this.scene = scene;
        this.next_point_id = getMaxID(scene.points);
        this.next_line_id = getMaxID(scene.lines);
        this.trigger(scene, 'load scene');
    },
    onSaveScene: function(user_id, cb) {
        var scene = this.scene;
        _.keys(scene.points).forEach(function(id) {
            if (id[0] === '0') {
                var point = scene.points[id];
                delete scene.points[id];
                scene.points[user_id + id.slice(1)] = point;
            }
        });
        _.keys(scene.lines).forEach(function(id) {
            if (id[0] === '0') {
                var line = scene.lines[id];
                delete scene.lines[id];
                scene.lines[user_id + id.slice(1)] = line;
            }
        });
        _.values(scene.lines).forEach(function(line) {
            if (line.p1[0] === '0') {
                line.p1 = user_id + line.p1.slice(1);
            }
            if (line.p2[0] === '0') {
                line.p2 = user_id + line.p2.slice(1);
            }
        });
        cb(scene);
    },
    // editing functions
    // no snapping but stuff will get more complicated when that's implemented
    onDrawLine: function (id, p1, p2) {
        var scene = this.scene;
        var p1ID = id + '_' + this.next_point_id;
        var p2ID = id + '_' + (this.next_point_id + 1);
        var lineID = id + '_' + this.next_line_id;
        // no correction for pan/zoom
        scene.points[p1ID] = p1;
        scene.points[p2ID] = p2;
        scene.lines[lineID] = { p1: p1ID, p2: p2ID };
        this.next_point_id = this.next_point_id + 2;
        this.next_line_id = this.next_line_id + 1;
        this.trigger(scene);
        this.trigger(lineData(p1ID, p2ID, lineID, p1, p2), 'add');
    },
    onEraseLines: function (pos) {
        var scene = this.scene;
        var deletedLines = _.keys(scene.lines).filter(function(id) {
            var line = scene.lines[id];
            var p1 = scene.points[line.p1];
            var p2 = scene.points[line.p2];
            // console.log(lineSegmentDistance(pos, {p1: p1, p2: p2}))
            return lineSegmentDistance(pos, {p1: p1, p2: p2}) < ERASER_RADIUS;
        }).map(function(id) {
            var line = scene.lines[id];
            var p1 = scene.points[line.p1];
            var p2 = scene.points[line.p2];
            delete scene.points[line.p1];
            delete scene.points[line.p2];
            delete scene.lines[id];
            return lineData(line.p1, line.p2, id, p1, p2);
        }.bind(this));
        if (deletedLines.length > 0) {
            this.trigger(_.flatten(deletedLines), 'remove');
        }
        this.trigger(scene);
    },
    onAddLine: function(data) {
        data.forEach(function (e) {
            switch (e.type) {
                case ENTITY.POINT:
                    this.scene.points[e.id] = {
                        x: e.x,
                        y: e.y
                    };
                    break;
                case ENTITY.LINE:
                    this.scene.lines[e.id] = {
                        p1: e.p1,
                        p2: e.p2
                    };
                    break;
            }
        }.bind(this));
        this.trigger(this.scene);
    },
    onRemoveLine: function(data) {
        data.forEach(function (e) {
            switch (e.type) {
                case ENTITY.POINT:
                    delete this.scene.points[e.id];
                    break;
                case ENTITY.LINE:
                    delete this.scene.lines[e.id];
                    break;
            }
        }.bind(this));
        this.trigger(this.scene);
    }
});

module.exports = SceneStore;
