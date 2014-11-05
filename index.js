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

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// // Passport session setup.
// // figure out how to findById alternative !!!!!
// //   To support persistent login sessions, Passport needs to be able to
// //   serialize users into and deserialize users out of the session.  Typically,
// //   this will be as simple as storing the user ID when serializing, and finding
// //   the user by ID when deserializing.
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   findById(id, function (err, user) {
//     done(err, user);
//   });
// });



// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // check also if the database had errors!
        //  if (err) { return done(err); }
        User.where({username: username}).fetch().then(function(user){
            if (user === null) {
                console.log("This username did not exist!");
                return done(null, false, { message: 'Unknown user ' + username });
            }
            if (user.get('password') != password) {
                return done(null, false, { message: 'Invalid password'});
            }
            return done(null, user);
        });
    })
);





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
// dummy authentication
}).then(function () {


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
