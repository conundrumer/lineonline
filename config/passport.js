
// ??? REPLACEMENTS FOR THESE ARE?
// var mongoose = require('mongoose');
// var User = mongoose.model('User');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Need to set up knex and bookshelf elsewhere...do this better!
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

module.exports = function (passport, config) {

    // Passport session setup.
    // figure out how to findById alternative !!!!!
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.
    passport.serializeUser(function(model, done) {
        console.log("serializing: " + model.get('id'));
      done(null, model.get('id'));
    });

    passport.deserializeUser(function(id, done) {
        console.log("Deserializing: " + id + "hello!");
        User.where({id:id}).fetch().then(function(model) {
            done(null, model);
        }).catch(function (err) {
            console.error(err);
            done(err, null);
        });
    });


    // Use the LocalStrategy within Passport.
    //   Strategies in passport require a `verify` function, which accept
    //   credentials (in this case, a username and password), and invoke a callback
    //   with a user object.
    passport.use(new LocalStrategy(
        function(username, password, done) {
            // check also if the database had errors!
            console.log("Trying to authenticate someone 1.");
            User.where({username: username}).fetch().then(function(model){
                if (model === null) {
                    console.log("This username did not exist!");
                    return done(null, false, { message: 'Unknown user ' + username });
                }
                if (model.get('password') != password) {
                    console.log("Incorrect password.");
                    return done(null, false, { message: 'Invalid password'});
                }
                console.log("Correct password! Logging you in!");
                return done(null, model); // TODO: parse the model to something easier to work with
            }).catch(console.error);
        })
    );

};
