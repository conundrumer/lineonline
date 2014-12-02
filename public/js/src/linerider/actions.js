var Reflux = require('reflux');

var EditorActions = Reflux.createActions([
    'newScene',
    'loadScene',
    'addLine',
    'removeLines'
]);

module.exports = EditorActions;
