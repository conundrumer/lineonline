var Reflux = require('reflux');

var EditorActions = Reflux.createActions([
    'newScene',
    'loadScene',
    'drawLine',
    'eraseLines'
]);

module.exports = EditorActions;
