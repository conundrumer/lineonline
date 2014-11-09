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

//views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//middleware
// app.use(express.logger('dev')); //log incoming requests to console
app.use(express.static(__dirname + '/public')); //serve static files

//routes
app.get('/', function(req, res) {
    //res.send('<div style="color:red;">Hello World!</div>');
    res.render('index', { title: 'LineOnline' });
});
app.get('/signup-login', function(req, res) {
    res.render('signup-login', { title: 'Signup/Login', state: 'signedOut' });
});
app.get('/home', function(req, res) {
    res.render('home', { title: 'Home' });
});
app.get('/gallery', function(req, res) {
    res.render('gallery', { title: 'Gallery' });
});
app.get('/your-tracks', function(req, res) {
    res.render('your-tracks', { title: 'Your Tracks' });
});
app.get('/profile', function(req, res) {
    res.render('profile', { title: 'Profile' });
});
app.get('/favorites', function(req, res) {
    res.render('profile', { title: 'Favorites' });
});
app.get('/subscriptions', function(req, res) {
    res.render('subscriptions', { title: 'Subscriptions' });
});
app.get('/settings', function(req, res) {
    res.render('settings', { title: 'Settings' });
});
app.get('/logout', function(req, res) {
    res.redirect('/signup-login');
});
app.get('/login', function(req, res) {
    res.redirect('/');
});



//server initialization
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
