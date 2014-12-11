var Reflux = require('reflux');

var EditorActions = Reflux.createActions([
    'newScene',
    'loadScene',
    'saveScene',
    'drawLine',
    'eraseLines',
    'addLine',
    'removeLine'
]);

module.exports = EditorActions;
