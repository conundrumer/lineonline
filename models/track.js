var User = require('./user').model;

var USE_JSONB = false;
var Track = require('../db/create-model')({
    tableName: 'tracks',
    build: function (table) {
        table.increments('id').primary();
        table.string('title', 100);
        table.string('description', 100);
        table.integer('owner').references('users.id');
        table.json('scene', USE_JSONB);
        table.float('preview_top');
        table.float('preview_left');
        table.float('preview_bottom');
        table.float('preview_right');
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



