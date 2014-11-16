
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

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
/**
 * Expose
 */

module.exports = function (app, passport) {

// Start the database and authentication
// app.configure(function() {
    // ALL OF THESE NO LONGER BUNDLED WITH EXPRESS
    // app.use(express.logger());

    app.use(cookieParser());
    // need to specify which parsers we want to use
    // for parsing application/json
    app.use(bodyParser.json());
    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));


    // app.use(express.methodOverride());
    app.use(session({ secret: 'supa secret homies!', resave: true, saveUninitialized: true }));
    app.set('bookshelf', bookshelf);

    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(app.router); // DEPRECATED

    // });



    //middleware
    // app.use(express.logger('dev')); //log incoming requests to console
    app.use(express.static(__dirname + './../public')); //serve static files


}
