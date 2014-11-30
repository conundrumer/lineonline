var bookshelf = require('../db/bookshelf.dev');
var User = require('./user');
var Track = require('./track');

var Invitation = bookshelf.Model.extend({
    tableName: 'invitation',
}, {
    tableName: 'invitation',
    build: function (table) {
        table.increments('id').primary();
    }
});

module.exports = Invitation;
