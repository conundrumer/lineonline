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

knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('username');
    table.timestamps();
}).then(function () {
    var User = bookshelf.Model.extend({
        tableName: 'users'
    });

    User.forge({username:'delu'}).save().then(function(){
        console.log('hi hi hi hihi');
    });
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
