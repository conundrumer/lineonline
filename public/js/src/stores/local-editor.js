var Reflux = require('reflux');
var Actions = require('../actions');
var Line2D = require('line2d');

function addLine(lineData, scene) {
    return Line2D.makeSceneFromJSON(scene)
        .points.add(lineData.p)
        .points.add(lineData.q)
        .lines.add(lineData.line)
        .toJSON();
}

function eraseLines(lines, scene) {
    return Line2D.makeSceneFromJSON(scene)
        .lines.erase(lines)
        .toJSON();
}

var LocalEditorStore = Reflux.createStore({
    listenables: [Actions],
    getLocalTrackKey: function() {
        return 'unsaved_scene';
    },
    getLocalScene: function() {
        var scene;
        try {
            scene = JSON.parse(localStorage[this.getLocalTrackKey()]);
        } catch (SyntaxError) {
            // i don't know what to do here
            console.log("couldn't parse local scene, clearing...");
            scene = {
                points:{},
                lines:{}
            };
            this.setLocalScene(scene);
        }
        return scene;
    },
    setLocalScene: function(scene) {
        localStorage[this.getLocalTrackKey()] = JSON.stringify(scene);
    },
    getDefaultData: function() {
        return this.getLocalScene();
    },
    onNewTrack: function() {
        this.setLocalScene({
            points:{},
            lines:{}
        });
    },
    onCreateTrack: function() {
        this.onNewTrack();
    },
    onEmitAddLine: function(data, isNewTrack) {
        if (isNewTrack) {
            this.addLine(data);
        }
    },
    onEmitRemoveLine: function(data, isNewTrack) {
        if (isNewTrack) {
            this.removeLine(data);
        }
    },
    addLine: function(data) {
        var scene = this.getLocalScene();
        scene = addLine(data, scene);
        this.setLocalScene(scene);
    },
    removeLine: function(data) {
        var scene = this.getLocalScene();
        scene = eraseLines(data, scene);
        this.setLocalScene(scene);
    }
});

module.exports = LocalEditorStore;
