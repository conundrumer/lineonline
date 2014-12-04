var bookshelf = require('../db/bookshelf.dev');
var User = require('./user');
var Track = require('./track');

var Collaboration = bookshelf.Model.extend({
    tableName: 'collaborations',
    track: function() {
        return this.belongsTo(Track, 'track');
    },
    collaborator: function() {
        return this.belongsTo(User, 'collaborator');
    }
}, {
    tableName: 'collaborations',
    build: function (table) {
        table.increments('id').primary();
        table.integer('track').references('tracks.id');
        table.integer('collaborator').references('users.id');
    }
});

module.exports = bookshelf.model('Collaboration', Collaboration);
