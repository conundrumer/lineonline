var knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'webapps',
        password: 'fun',
        database: 'lineonline',
        charset: 'utf8'
    }
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
    tableName: 'users'
});

// testing what we can do with knex and bookshelf
knex.schema.dropTableIfExists('users').then(function() {
    return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.string('username', 100);
        t.string('password', 100);
    });
// create user with password
}).then(function () {
    return User.forge({username:'delu',password:'yourmother'}).save().then(function(){
        console.log('created user "delu" with password "yourmother"');
    });
// change user password
}).then(function() {
    return User.where({username:'delu',password:'yourmother'}).fetch().then(function(model){
        console.log('before password: '+ model.get('password'));
        model.set({password: 'mymother'});
        return model.save(); // save/return async promises
    });
// password changed
}).then(function() {
    return User.where({username:'delu'}).fetch().then(function(model){
        console.log('after password: '+ model.get('password'));
    });
// delete users
}).then(function() {
    return User.where({username:'delu'}).destroy();
// check to see delu has been deleted
}).then(function() {
    return User.where({username:'delu'}).fetch().then(function(model){
        if (model === null) {
            console.log("delu has been destroyed");
        }
    });
// add other elements to users
}).then(function() {

// destroy the table
}).then(function() {
    knex.schema.dropTable('users');
});

var express = require('express');
var app = express();
app.set('bookshelf', bookshelf);

app.get('/', function(req, res) {
    res.send('<div style="color:red;">Hello World!</div>');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
