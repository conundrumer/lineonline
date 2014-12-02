var Reflux = require('reflux');

var EditorActions = Reflux.createActions([
    'newScene',
    'loadScene',
    'drawLine',
    'eraseLines',
    'addLine',
    'removeLine'
]);

module.exports = EditorActions;
