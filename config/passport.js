var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport, config) {

    // Passport session setup.
    passport.serializeUser(function(userModel, done) {
      done(null, userModel.get('id'));
    });

    passport.deserializeUser(function(id, done) {
        User.getByID(id).then(function(userModel) {
            done(null, userModel);
        }).catch(function (err) {
            console.error(err);
            done(err, null);
        });
    });


    // Use the LocalStrategy within Passport.
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.where({username: username}).fetch().then(function(model){
                if (model === null) {
                    return done(null, false, { message: 'Unknown user ' + username });
                }
                if (model.get('password') != password) {
                    return done(null, false, { message: 'Invalid password'});
                }
                return done(null, model);
            }).catch(function (err) {
                console.error(err);
                done(err, null);
            });
        })
    );

};
