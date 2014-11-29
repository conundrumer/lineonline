var Reflux = require('reflux');
var request = require('superagent');
var Data = require('./store');
var StatusTypes = require('status-types');

var Actions = Reflux.createActions([
    //auth
    'getCurrentUser',
    'login',
    'logout',
    'signup',

    //profile
    'getProfile',
    'getCollections'
]);

module.exports = Actions;
