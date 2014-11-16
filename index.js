
var express = require('express');
var passport = require('passport');
var config = require('./config/config');
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
    tableName: 'users',

    subscriptions: function(){
        return this.hasMany(User, 'subscriptions');
    },
    subscribers: function(){
        return this.hasMany(User, 'subscribers');
    }

});




/* Track Model */


// testing what we can do with knex and bookshelf
knex.schema.dropTableIfExists('users').then(function() {
    return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.string('username', 100);
        t.string('password', 100);
        t.string('email', 100);
        t.string('about', 300);
        t.string('location', 100);



    });
// create user with password
}).then(function () {
    return User.forge({
        username:'delu',
        password:'yourmother',
        email:'delu@andrew.cmu.edu'
    }).save().then(function(){
        console.log('created user "delu" with password "yourmother"');
    });
// create second user
}).then(function () {
    return User.forge({
        username:'snig',
        password:'a',
        email:'snig@sniggy.antarctica'
    }).save().then(function(){

        console.log('created user "snig" with password "a"');
    });
// dummy authentication
}).then(function () {
// change user password
}).then(function() {
    return User.where({username:'delu',password:'yourmother'}).fetch().then(function(model){
        console.log('before password: '+ model.get('password'));
        model.set({password: 'mymother'});
        // now add delu as his own subscriber
        // model.set(subscriptions)
        return model.save(); // save/return async promises
    });
// password changed
}).then(function() {
    return User.where({username:'delu'}).fetch().then(function(model){
        console.log('after password: '+ model.get('password'));

        subscriptions = model.related('subscriptions');
        subscriptions.add(model);


        subscriptions.forEach(function(s){
             console.log("The name of the subscribed is: " + s.get("username"));
             console.log(s);
        });

        console.log('user\'s subscriptions include:' + subscriptions);
        model.save();
    });
// delete users
}).then(function() {
    // return User.where({username:'delu'}).destroy();
// check to see delu has been deleted
// }).then(function() {
//     return User.where({username:'delu'}).fetch().then(function(model){
//         if (model === null) {
//             console.log("delu has been destroyed");
//         }
//     });
// add other elements to users
}).then(function() {

// destroy the table
}).then(function() {
    // knex.schema.dropTable('users');
});

// Start the app / server
var app = express();
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
// Bootstrap passport config ??? => Passport config
require('./config/passport')(passport, config);

// Bootstrap application settings ??? => Application settings
require('./config/express')(app, passport);

// Bootstrap routes ??? => Routes
require('./config/routes')(app, passport);
