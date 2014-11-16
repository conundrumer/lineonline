var bookshelf = require('bookshelf').pgAuth;
var User = require('./user').model;

var Track = bookshelf.Model.extend({
    tableName: 'tracks',
    build: function (table) {
        table.increments('id').primary();
        table.string('title', 100);
        table.string('description', 100);
    },
    owner: function(){
        return this.belongsTo(User, 'owner_id');
    },
    collaborators: function(){
        return this.hasMany(User, 'collaborators');
    },
    invites: function(){
        return this.hasMany(User, 'invites');
    },
    tags: function(){
        return this.hasMany(User, 'tags');
    }

});

exports.model = Track;



