var User = require('../models/user');
var Track = require('../models/track');
var passport = require('passport');

var StatusTypes = {
    created: 201,
    accepted: 202,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    notAcceptable: 406,
    notFound: 404
};

exports.logout = function(req, res) {
    console.log("logout")
    req.logout();
    console.log(res.noContent);
    res.status(StatusTypes.noContent).send();
}

exports.getCurrentUser = function(req, res) {
    req.params.id = req.user.get('id');
    exports.getUserJson(req, res);
}

exports.doRegister = function(req, res){
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;
    console.log(JSON.stringify(req.body));

    if (req.body.username === ''
        || req.body.email === ''
        || req.body.password === '') {
        res.status(StatusTypes.notAcceptable).send({message: 'All fields are required'});
        return;
    }

    // Verify valid input
    User.where({username: username}).fetch().then(function(model){
        if (model === null) {
            console.log('making new user')
            console.log(username, password)
            User.forge({username:username, password:password, email:email}).save().then(function(){
                console.log('new user', username, password);
                statuslogin(StatusTypes.accepted, req, res, console.error);
            }).catch(console.error); // CREATE OWN ERROR FN TO TELL USERS SOMEONE DUN GOOFED
        } else { // If someone else already has that username
            res.status(StatusTypes.notAcceptable).send({message:'This username has already been taken'});
        }
    }); // PUT A CATCH HERE

}

function statuslogin (status, req, res, next) {
    console.log('inlogin')
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        console.log("WHAT IS USER")
        console.log(user)
        console.log(info)
        if (!user) { return res.status(StatusTypes.unauthorized).send(info); }
        console.log("ATTEMPTIPNG LOGIN TI")
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.params.id = user.get('id');
            exports.getUserJson(req, res, status);
        });
    })(req, res, next);
}

exports.login = statuslogin.bind(null, null);

exports.getProfileJson = function(req, res){
    console.log('iDDDDDD ', req.params.id);
    var id = req.params.id;
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            // res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
            res.status(StatusTypes.notFound);
        }
        else {
            var old = {
                title: 'Profile',
                username: model.get('username'),
                email: model.get('email'),
                location: model.get('location'),
                about: model.get('about')
            };

            var SampleUser2 = {
                id: 2,
                username: 'snigdhar',
                avatar_url: '/images/snigdhar.jpg'
            };
            var SampleTrack1 = {
                title: 'Sample Track 1',
                description: 'Description of sample track 1.',
                owner: SampleUser2,
                collaborators: [
                ],
                blob: 'Blob string of featured track',
                thumbUrl: '/images/sample_masthead.png'
            };

            var data = {
                id: id,
                featured_track: SampleTrack1,
                username: model.get('username'),
                avatar_url: model.get('avatar_url') || '/images/default.png',
                email: model.get('email') || 'N/A',
                location: model.get('location') || 'N/A',
                about: model.get('about') || 'N/A',
            };

            res.status(StatusTypes.accepted).json(data);
        }
    });
}

exports.updateProfileJson = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            // Update the profile and then return it
            console.log("DOES REQ.BODY WORK LIKE THIS?");
            console.log(req.body); // does this work?

            // Assuming you can query body like this
            if (req.body.get("location") != ""){
                model.set({location: req.body.get("location")});
            }

            if (req.body.get("about") != ""){
                model.set({about: req.body.get("about") });
            }

            if (req.body.get("avatar_url") != ""){
                model.set({avatar_url: req.body.get("avatar_url")});
            }
            model.save();

            res.json({
                title: 'Profile',
                username: model.get('username'),
                email: model.get('email'),
                location: model.get('location'),
                about: model.get('about')
            });
        }
    });
}


exports.editProfile = function(req, res){
    // email = req.body.email
    location = req.body.location
    about = req.body.about

    model = req.user
    // console.log(JSON.stringify(req.body));

    // if (email != ""){
    //     model.set({email: email});
    // }

    if (location != ""){
        model.set({location: location});
    }

    if (about != ""){
        model.set({about: about});
    }

    model.save();
    res.redirect('/profile/'+model.get('id'));

}

exports.getSubscriptions = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Couldn\'t find my own model!</div>');
        }
        else {
            subscriptions = model.related('subscriptions');

            array = []
            console.log(subscriptions);
            console.log("subscriptions are..." + subscriptions);
            // subscriptions.forEach(function(s){
            //     // ??? usernames or ids?
            //     // should probably send the id so it can be used to
            //     // go to other people's profiles
            //     array.append({s.get('username'), s.get('id')});
            // });
            res.json({
                'subscriptions': array
            })

        }
    });
}

exports.subscribeTo = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Couldn\'t find my own model!</div>');
        }
        else {
            User.where({id: req.params.targetId}).fetch().then(function(targetModel){
                if (targetModel === null){
                    res.send('<div style="color:red;">Couldn\'t find target model!</div>');
                }
                else{
                    model.related('subscriptions').add(targetModel);
                    // should send back json that indicates you are now
                    // subscribed to this person...
                    res.send('<div style="color:red;">Added to subscriptions!</div>');
                }

            });
        }
    });
}

exports.unsubscribeFrom = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Couldn\'t find my own model!</div>');
        }
        else {
            User.where({id: req.params.targetId}).fetch().then(function(targetModel){
                if (targetModel === null){
                    res.send('<div style="color:red;">Couldn\'t find target model!</div>');
                }
                else{
                    model.related('subscriptions').remove(targetModel);
                    // should send back json that indicates you are now
                    // subscribed to this person...
                    res.send('<div style="color:red;">Removed from subscriptions!</div>');
                }

            });
        }
    });
}

exports.getUserJson = function(req, res, status){
    status = (typeof status === 'number' && status) || StatusTypes.accepted;
    var id = req.params.id;
    console.log("User id is: " + req.params.id);
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            var d1 = {
                "_links": {
                    'self': { 'href': '/users/' + id },
                    'profile': { 'href': '/users/' + id + '/profile' },
                    'favorites': { 'href': '/users/' + id + '/favorites' },
                    'subscriptions': { 'href': '/users/' + id + '/subscriptions' },
                    'collections': { 'href': '/users/' + id + '/collections'},
                    'tracks': { 'href': '/users/' + id + '/tracks'}
                },
                id: id,
                username: model.get('username'),
                avatar_url: null // model.get("avatar_url")
            };
            var data = {
                id: id,
                username: model.get('username'),
                avatar_url: model.get('avatar_url') || '/images/default.png',
            };
            // info: {
            //     email: model.get('email'),
            //     location: model.get('location') || 'N/A',
            //     description: model.get('about') || 'N/A',
            // },

            // featured_track: null,
            // collections: []
            res.status(status).json(data);
        }
    });
}


exports.getCollectionsJson = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            var d = {
                "_links": {
                    "self": { "href": "/users/" + req.params.id + "/profile" },
                    "user": { "href": "/users/" + req.params.id}
                },
                 "_embedded": {
                    "collections": [
                        {
                            "track1": "track1_id",
                            "track2": "track2_id"
                        }
                    ]
                },
                "total" : 42, // model.get("collections").size
            };
            var SampleUser1 = {
                id: 1,
                username: 'delu',
                avatar_url: '/images/delu.jpg'
            };
            var SampleUser2 = {
                id: 2,
                username: 'snigdhar',
                avatar_url: '/images/snigdhar.jpg'
            };
            var SampleUser3 = {
                id: 3,
                username: 'jingxiao',
                avatar_url: '/images/sample_profile.png'
            };
            var SampleTrack1 = {
                title: 'Sample Track 1',
                description: 'Description of sample track 1.',
                owner: SampleUser1,
                collaborators: [
                ],
                blob: 'Blob string of featured track',
                thumbUrl: '/images/sample_masthead.png'
            };
            var SampleTrack2 = {
                title: 'Sample Track 2',
                description: 'Description of sample track 2.',
                owner: SampleUser2,
                collaborators: [
                ],
                blob: 'Blob string of sample track 2',
                thumbUrl: '/images/sample_masthead.png'
            };
            var SampleCollection1 = {
                title: 'Sample Collection Title 1',
                description: 'Description of Sample Collection 1',
                tracks: [
                    SampleTrack1,
                    SampleTrack2,
                ]
            }
            var SampleCollection2 = {
                title: 'Sample Collection Title 2',
                description: 'Description of Sample Collection 2',
                tracks: [
                    SampleTrack2
                ]
            }
            var data = [
                SampleCollection1,
                SampleCollection2
            ];
            console.log('collections json!');
            res.status(StatusTypes.accepted).json(data);

        }
    });
}

exports.register = function(req, res){
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;
    // console.log(JSON.stringify(req.body));

    if (req.body.username === ""){
        res.send('<div style="color:red;">This username! Who ARE you???</div>');
        return;
    }

    // Password non-empty
    if (req.body.password === ""){
        res.send('<div style="color:red;">This password! Where is this password???</div>');
        return;
    }

    // Verify valid input
    User.where({username: username}).fetch().then(function(model){
        if (model === null) {
            User.forge({username:username, password:password, email:email}).save().then(function(){
                console.log(username, password);
                res.send('<div style="color:red;">You registered for real!</div>');
            }).catch(console.error); // CREATE OWN ERROR FN TO TELL USERS SOMEONE DUN GOOFED
        } else { // If someone else already has that username
            res.send('<div style="color:red;">This username already exists!</div>');
        }
    }); // PUT A CATCH HERE

}

exports.visitProfile = function(req, res){
    //login user with id = id
    //The value of id = req.params.id

    console.log(req);
    console.log(req.params.id);
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            visitUserProfile(req, res, model);
        }
    });



}

exports.visitUserProfile = function(req, res, model) {
    res.render('profile', {
        title: 'Profile',
        username: model.get('username'),
        email: model.get('email'),
        location: model.get('location'),
        about: model.get('about')
    });
}


exports.editAccount = function(req, res) {
    model = req.user;

    newEmail = req.body.newEmail;
    currentPassword = req.body.currentPassword;
    newPassword = req.body.newPassword;

    if (newEmail) {
        console.log('email changed');
        model.set({email: newEmail});
    }

    // this is ugly
    if (currentPassword) {
        if (currentPassword === model.get('password')) {
            // if (currentPassword === newPassword) {
                console.log('password changed');
                model.set({password: newPassword});
            // } else {
            //     console.log('passwords did not match');
            // }
        } else {
            console.log('current password is incorrect');
        }
    }

    model.save();
    res.redirect('/settings');
}

exports.getSingleTrackJson =  function(req, res){
    // Gets a particular track
    Track.where({id: req.params.track_id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            res.json(model.toJSON());
        }
    });
}
exports.getAllTracksJson = function(req, res){
    // requires both the user id and the track id
    User.where({id: req.params.user_id}).fetch().then(function(user){
        // If id doesn't exist, send 404 page
        if (user === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            var tracks = user.related('tracks');
            res.json(tracks.toJSON());


        }
    });
}

exports.getFavoritesJson = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(user){
        // If id doesn't exist, send 404 page
        if (user === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            res.json( (user.related('favorites')).toJSON() );
        }
    });
}

exports.addToFavorites = function(req, res){
    // requires both the user id and the track id
    User.where({id: req.params.user_id}).fetch().then(function(user){
        // If id doesn't exist, send 404 page
        if (user === null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {

            Track.where({id: req.params.track_id}).fetch().then(function(track){
                // If id doesn't exist, send 404 page
                if (track === null){
                    res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
                }
                else {
                    var favorites = track.related('favorites');
                    favorites.add(track);
                    res.json( favorites.toJSON() );
                }
            });

        }
    });
}

exports.createTrack = function(req, res){
    console.log("Got here 1!");
    // I have the title, description and owner_id for the track
    var title = req.param('title');
    var description = req.param('description');
    var owner = req.param('owner');


    console.log("Got here 2!");

    Track.forge({
        title: title,
        description: description
        //owner: owner_id
    }).save().then(function(track){
        console.log("Got here 3!");
        //get a user to attach this to
        User.where({owner: owner}).fetch().then(function(trackUser){
            track.set(owner, owner);
            //track.related('owner_id').set(owner_id);
            track.save();
        });
        res.status(StatusTypes.accepted).json(track.toJSON());

    });
}

