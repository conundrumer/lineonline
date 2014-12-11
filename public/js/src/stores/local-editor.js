var Reflux = require('reflux');
var Actions = require('../actions');

// subject to change
var ENTITY = {
    POINT: 0,
    LINE: 1
};

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
        data.forEach(function (e) {
            switch (e.type) {
                case ENTITY.POINT:
                    scene.points[e.id] = {
                        x: e.x,
                        y: e.y
                    };
                    break;
                case ENTITY.LINE:
                    scene.lines[e.id] = {
                        p1: e.p1,
                        p2: e.p2
                    };
                    break;
            }
        });
        this.setLocalScene(scene);
    },
    removeLine: function(data) {
        var scene = this.getLocalScene();
        data.forEach(function (e) {
            switch (e.type) {
                case ENTITY.POINT:
                    delete scene.points[e.id];
                    break;
                case ENTITY.LINE:
                    delete scene.lines[e.id];
                    break;
            }
        });
        this.setLocalScene(scene);
    }
});

module.exports = LocalEditorStore;
