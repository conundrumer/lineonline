var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var encrypt = require(__base + 'util/encrypt');

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
                var enc = encrypt.encryptPassword(password);
                if (model.get('password') != enc) {
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
