var Reflux = require('reflux');
var Actions = require('../actions');

// subject to change
var ENTITY = {
    POINT: 0,
    LINE: 1
};

var LocalEditorStore = Reflux.createStore({
    listenables: [Actions],
    getDefaultData: function() {
        if (localStorage.unsaved_scene) {
            try {
                this.scene = JSON.parse(localStorage.unsaved_scene);
            } catch (e) {
                this.scene = {
                    points:{},
                    lines:{}
                };
                localStorage.unsaved_scene = JSON.stringify(this.scene);
            }
        } else {
            this.scene = {
                points:{},
                lines:{}
            };
            localStorage.unsaved_scene = JSON.stringify(this.scene);
        }
        return this.scene;
    },
    setScene: function(scene) {
        this.scene = scene;
        localStorage.unsaved_scene = JSON.stringify(scene);
    },
    onNewTrack: function() {
        this.setScene({
            points:{},
            lines:{}
        });
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
        var scene = this.getDefaultData();
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
        this.setScene(scene);
    },
    removeLine: function(data) {
        var scene = this.getDefaultData();
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
        this.setScene(scene);
    }
});

module.exports = LocalEditorStore;
