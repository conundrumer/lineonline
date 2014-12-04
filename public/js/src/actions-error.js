var Reflux = require('reflux');
var ErrorActions = Reflux.createActions([
    'throwError',
    'acknowledge'
]);

module.exports = ErrorActions;
