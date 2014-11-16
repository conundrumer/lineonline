
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

/**
 * Expose
 */

module.exports = function (app, passport) {
    app.use(cookieParser());
    // need to specify which parsers we want to use
    // for parsing application/json
    app.use(bodyParser.json());
    // for parsing application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({ secret: 'supa secret homies!', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(__dirname + './../public')); //serve static files
};
