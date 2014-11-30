var bookshelf = require('../db/bookshelf.dev');
var User = require('./user');
var Track = require('./track');

var Invitation = bookshelf.Model.extend({
    tableName: 'invitation',
    track: function() {
        return this.belongsTo(Track);
    },
    invitee: function() {
        return this.belongsTo(User, 'invitee');
    }
}, {
    tableName: 'invitation',
    build: function (table) {
        table.increments('id').primary();
        table.integer('track').references('tracks.id');
        table.integer('invitee').references('users.id');
    }
});

module.exports = Invitation;
