var Reflux = require('reflux');
var ErrorActions = Reflux.createActions([
    'throwError',
    'throwUnknownStatus',
    'acknowledge'
]);

module.exports = ErrorActions;
