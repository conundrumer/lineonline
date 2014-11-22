var Promise = require('bluebird');
var StatusTypes = require('status-types');
var passport = require('passport');

var User = require('../models/user');

exports.logout = function(req, res) {
    req.logout();
    res.status(StatusTypes.noContent).send();
};

exports.getCurrentUser = function(req, res) {
    res.status(200).json(req.user.asUserSnippet());
};

exports.doRegister = function(req, res){
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;

    if (username === ''){
        res.status(StatusTypes.badRequest)
            .send({message:'Username required'});
        return;
    }
    if (password === ''){
        res.status(StatusTypes.badRequest)
            .send({message:'Password required'});
        return;
    }
    if (email === ''){
        res.status(StatusTypes.badRequest)
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
