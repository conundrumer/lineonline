var User = require('./user').model;

var Track = require('../db/create-model')({
    tableName: 'tracks',
    build: function (table) {
        table.increments('id').primary();
        table.string('title', 100);
        table.string('description', 100);
        table.integer('owner').references('users.id');
    },
    owner: function(){
        return this.belongsTo(User, 'owner');
    }
    // collaborators: function(){
    //     return this.hasMany(User, 'collaborators');
    // },
    // invites: function(){
    //     return this.hasMany(User, 'invites');
    // },
    // tags: function(){
    //     return this.hasMany(User, 'tags');
    // }

});

module.exports = Track;



