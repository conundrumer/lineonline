var User = require('../models/user');

exports.getProfileJson = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model == null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
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

exports.updateProfileJson = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model == null){
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
        if (model == null){
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
        if (model == null){
            res.send('<div style="color:red;">Couldn\'t find my own model!</div>');
        }
        else {
            User.where({id: req.params.targetId}).fetch().then(function(targetModel){
                if (targetModel == null){
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
        if (model == null){
            res.send('<div style="color:red;">Couldn\'t find my own model!</div>');
        }
        else {
            User.where({id: req.params.targetId}).fetch().then(function(targetModel){
                if (targetModel == null){
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

exports.getUserJson = function(req, res){
    console.log("User id is: " + req.params.id);
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model == null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            res.json({
                "_links": {
                    "self": { "href": "/users/" + req.params.id + "/profile" },
                    "user": { "href": "/users/" + req.params.id}
                },
                "location": model.get("location"),
                "about": model.get("about"),
                "avatar_url": "http://www.example.com/avatar.png" // model.get("avatar_url")
            });
        }
    });
}


exports.getCollectionsJson = function(req, res){
    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model == null){
            res.send('<div style="color:red;">Are you hallucinating again? GO TO SLEEP!</div>');
        }
        else {
            res.json({
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
            });

        }
    });
}

exports.register = function(req, res){
    username = req.body.username;
    password = req.body.password;
    email = req.body.email;
    // console.log(JSON.stringify(req.body));

    if (req.body.username == ""){
        res.send('<div style="color:red;">This username! Who ARE you???</div>');
        return;
    }

    // Password non-empty
    if (req.body.password == ""){
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


    User.where({id: req.params.id}).fetch().then(function(model){
        // If id doesn't exist, send 404 page
        if (model == null){
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
