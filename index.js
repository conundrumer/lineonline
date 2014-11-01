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
}).then(function () {
    User.forge({username:'delu',password:'yourmother'}).save().then(function(){
        console.log('hi hi hi hihi');
    });
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
