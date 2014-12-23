var Reflux = require('reflux');
var _ = require('underscore');
var EditorActions = require('./actions');
var Line2D = require('line2d');

var P = Line2D.toPoint;
var L = Line2D.toLine;

function lineData(pid1, pid2, lid, p1, p2) {
    return {
        line: L([lid, [pid1, pid2]]),
        p: P([pid1, [p1.x, p1.y]]),
        q: P([pid2, [p2.x, p2.y]])
    };
}

function getMaxID(hashmap) {
    return _.keys(hashmap).map(function(id) {
        return parseInt(id.split('_')[1]);
    }).reduce(function(a,b){return Math.max(a,b);}, 0) + 1;
}

var SceneStore = Reflux.createStore({
    listenables: [EditorActions],
    getDefaultData: function() {
        this.scene = Line2D.newScene();
        this.next_point_id = 0;
        this.next_line_id = 0;
        return this.scene;
    },
    onNewScene: function () {
        this.trigger(this.getDefaultData(), 'new scene');
    },
    onLoadScene: function (scene) {
        this.next_point_id = getMaxID(scene.points);
        this.next_line_id = getMaxID(scene.lines);
        this.scene = Line2D.makeSceneFromJSON(scene);
        this.trigger(this.scene, 'load scene');
    },
    onSaveScene: function(user_id, cb) {
        var scene = this.scene.toJSON();
        _.keys(scene.points).forEach(function(id) {
            if (id[0] === '0') {
                var point = scene.points[id];
                delete scene.points[id];
                var new_id = user_id + id.slice(1);
                point.id = new_id;
                scene.points[new_id] = point;
            }
        });
        _.keys(scene.lines).forEach(function(id) {
            if (id[0] === '0') {
                var line = scene.lines[id];
                if (line.pq.p[0] === '0') {
                    line.pq.p = user_id + line.pq.p.slice(1);
                }
                if (line.pq.q[0] === '0') {
                    line.pq.q = user_id + line.pq.q.slice(1);
                }
                delete scene.lines[id];
                var new_id = user_id + id.slice(1);
                line.id = new_id;
                scene.lines[new_id] = line;
            }
        });
        this.scene = Line2D.makeSceneFromJSON(scene);
        cb(scene);
    },
    // editing functions
    // no snapping but stuff will get more complicated when that's implemented
    onDrawLine: function (id, p1, p2) {
        var p1ID = id + '_' + this.next_point_id;
        var p2ID = id + '_' + (this.next_point_id + 1);
        var lineID = id + '_' + this.next_line_id;

        this.next_point_id = this.next_point_id + 2;
        this.next_line_id = this.next_line_id + 1;

        var data = lineData(p1ID, p2ID, lineID, p1, p2);
        this.addLine(data);

        this.trigger(data, 'add');
    },
    onEraseLines: function (pos, radius) {
        var deletedLines = this.scene.lines.selectInRadius(pos, radius);
        if (deletedLines.length > 0) {
            this.removeLines(deletedLines);
            this.trigger(deletedLines, 'remove');
        }
    },
    onAddLine: function(data) {
        this.addLine(data);
    },
    onRemoveLine: function(data) {
        this.removeLines(data);
    },
    addLine: function(data) {
        this.scene = this.scene
            .points.add(data.p)
            .points.add(data.q)
            .lines.add(data.line);

        this.trigger(this.scene);
    },
    removeLines: function(data) {
        this.scene = this.scene.lines.erase(data);

        this.trigger(this.scene);
    }
});

module.exports = SceneStore;
