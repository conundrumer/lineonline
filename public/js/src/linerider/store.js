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

function getMaxID(hashmap) {
    return _.keys(hashmap).map(function(id) {
        console.log(id.split('_')[1])
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
        console.log("loaded scene, point line:", this.next_point_id, this.next_line_id)
        this.trigger(scene, 'load scene');
    },
    // editing functions
    // no snapping but stuff will get more complicated when that's implemented
    onDrawLine: function (id, p1, p2) {
        var scene = this.scene;
        var pointID = id + '_' + this.next_point_id;
        var lineID = id + '_' + this.next_line_id;
        // no correction for pan/zoom
        scene.points[pointID] = p1;
        scene.points[pointID+1] = p2;
        scene.lines[lineID] = { p1: pointID, p2: pointID+1 };
        this.next_point_id = this.next_point_id + 2;
        this.next_line_id = this.next_line_id + 1;
        this.trigger(scene, 'add line');
    },
    onEraseLines: function (pos) {
        var scene = this.scene;
        _.keys(scene.lines).filter(function(id) {
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
        }.bind(this));
        this.trigger(scene, 'remove lines');
    }
});

module.exports = SceneStore;
