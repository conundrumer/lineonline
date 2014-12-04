var Promise = require('bluebird');
var StatusTypes = require('status-types');
var User = require('../models/user');
var encrypt = require('encrypt');
var passport = require('passport');


exports.loginRequired = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not logged in'});
};

exports.logout = function(req, res) {
    req.logout();
    res.status(204).send();
};

exports.getCurrentUser = function(req, res) {
    res.status(200).json(req.user.asUserSnippet());
};

exports.register = function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    if (username === ''){
        res.status(400)
            .send({message:'Username required'});
        return;
    }
    if (password === ''){
        res.status(400)
            .send({message:'Password required'});
        return;
    }
    if (email === ''){
        res.status(400)
            .send({message:'Email required'});
        return;
    }

    new Promise.all([
        User.where({username: username}).fetch(),
        User.where({email: email}).fetch(),
    ]).then(function(models) {
        var usernameExists = models[0];
        var emailExists = models[1];
        if (usernameExists) {
            res.status(StatusTypes.badRequest)
                .send({message:'This username has already been taken'});
            return;
        }
        if (emailExists) {
            res.status(StatusTypes.badRequest)
                .send({message:'This email has already been taken'});
            return;
        }
        return User
            .create(req.body)
            .then(function(){
                statuslogin(201, req, res, console.error);
            });
    }).catch(console.error);
};

function statuslogin (status, req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            res.status(status).json(user.asUserSnippet());
        });
    })(req, res, next);
}

exports.login = statuslogin.bind(null, 200);

exports.settings = function(req, res) {
    var password = req.body.password;
    var newEmail = req.body.new_email;
    var newPassword = req.body.new_password;
    newPassword = (newPassword === req.body.confirm_password) ? newPassword : null;

    if (!isCorrectPassword(req.user, password)) {
        return res.status(StatusTypes.unauthorized).json({
            message: 'Incorrect password'
        });
    }

    if(newEmail) {
        return User
            .where({ email: newEmail})
            .fetch()
            .then(function(emailUsed) {
                if (emailUsed) {
                    return res.status(StatusTypes.badRequest).json({
                        message: 'Email already in use'
                    });
                }
                return req.user
                    .save({ email: newEmail }, {patch:true})
                    .then(function() {
                        res.status(204).send();
                    });
            })
            .catch(console.error);
    }

    if(newPassword) {
        return req.user
            .save({ password: encrypt.encryptPassword(newPassword) }, {patch:true})
            .then(function() {
                res.status(204).send();
            })
            .catch(console.error);
    }

    res.status(StatusTypes.badRequest).json({
        message: 'Missing fields'
    });
};

function isCorrectPassword(userModel, password) {
    return userModel.get('password') === encrypt.encryptPassword(password);
}
