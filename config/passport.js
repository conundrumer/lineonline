var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var crypto = require('crypto');
var crypto_alg = 'aes-256-ctr';
var crypto_password = 'delu';

function decrypt(password){
    var decipher = crypto.createDecipher(crypto_alg,crypto_password)
    var dec = decipher.update(password,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

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
                var dec = decrypt(model.get('password'));
                console.log("The decrypted password is: " + dec);
                if (dec != password) {
                    console.log("the password was wrong???");
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
