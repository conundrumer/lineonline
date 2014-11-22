var passport = require('passport');
var Promise = require('bluebird');
var StatusTypes = require('status-types');

var User = require('../models/user');

var ERRORS = {
    TRACK_NOT_FOUND: {
        message: 'No track exists with the given ID'
    },
    USER_NOT_FOUND: {
        message: 'No use exists with the given ID'
    }
};

exports.getTracks = function(req, res) {
    var user_id = req.params.id;

    User
        .getByID(user_id)
        .then(function (user) {
            return user.getTrackSnippets();
        })
        .then(function (trackSnippets) {
            res.status(200).json(trackSnippets);
        })
        .catch(User.NotFoundError, function() {
            res.status(404).json(ERRORS.USER_NOT_FOUND);
        })
        .catch(console.error);
};


exports.logout = function(req, res) {
    console.log('logout')
    req.logout();
    res.status(StatusTypes.noContent).send();
}

exports.getCurrentUser = function(req, res) {
    req.params.id = req.user.get('id');
    exports.getUserJson(req, res);
}

var DEFAULT_AVATAR_URL = '/images/default.png';
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
        return User.forge({
            username:username,
            password:password,
            email:email,
            avatar_url: DEFAULT_AVATAR_URL
        }).save().then(function(){
            console.log('new user', username, password);
            statuslogin(201, req, res, console.error);
        });
    }).catch(console.error); // CREATE OWN ERROR FN TO TELL USERS SOMEONE DUN GOOFED
};

function statuslogin (status, req, res, next) {
    console.log('inlogin')
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        console.log("WHAT IS USER")
        console.log(user)
        console.log(info)
        if (!user) { return res.status(401).send(info); }
        console.log("ATTEMPTIPNG LOGIN TI")
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.params.id = user.get('id');
            exports.getUserJson(req, res, status);
        });
    })(req, res, next);
}

exports.login = statuslogin.bind(null, null);

exports.getUserJson = function(req, res, status){
    status = (typeof status === 'number' && status) || 200;
    var id = req.params.id;
    console.log("User id is: " + req.params.id);
    User.where({id: req.params.id}).fetch({require: true})
    .then(function(model){
        res.status(status).json({
            user_id: id,
            username: model.get('username'),
            avatar_url: model.get('avatar_url')
        });
    }).catch(User.NotFoundError, function() {
        res.status(404).json({message: 'This user does not exist'});
    });
}
