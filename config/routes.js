// ??? Find a way to get User without writing this code in every file!
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


function getProfileJson(req, res){
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

function updateProfileJson(req, res){
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


function editProfile(req, res){
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

function getSubscriptions(req, res){
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

function subscribeTo(req, res){
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

function unsubscribeFrom(req, res){
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

function getUserJson(req, res){
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


function getCollectionsJson(req, res){
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

function register(req, res){
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

function visitProfile(req, res){
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

function visitUserProfile(req, res, model) {
    res.render('profile', {
        title: 'Profile',
        username: model.get('username'),
        email: model.get('email'),
        location: model.get('location'),
        about: model.get('about')
    });
}


function editAccount(req, res) {
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

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    // These are the urls we route to
    // req = request, res = response
    app.get('/-backend', function(req, res) {
        res.send('<div style="color:red;">Hello ' + (req.user ? req.user.get('username') : 'it') + '!</div>');
    });
    app.get('/login-backend', function(req,res){
        res.sendFile(__dirname + '/auth.html');

    });
    app.get('/register-backend', function(req,res){
        console.log("Get register.");
        res.sendFile(__dirname + '/register.html');

    });
    app.get('/edit-profile-backend', loginRequired, function(req,res){
        console.log("Get edit-profile.");
        res.sendFile(__dirname + '/edit-profile.html');

    });

    app.get('/profile-backend/:id', loginRequired, visitProfile);
    app.get('/faillogin-backend', function(req,res){
        res.sendFile(__dirname + '/nologin.html');
    });

    app.post('/login-backend', passport.authenticate('local', { successRedirect: '/home',
                                       failureRedirect: '/signup-login',
                                       failureFlash: false })

    );
    app.post('/register-backend', register);
    app.post('/edit-profile-backend', loginRequired, editProfile);
    app.post('/edit-account-backend', loginRequired, editAccount);

    app.get('/logout-backend', function(req, res){
      req.logout();
      res.redirect('/signup-login');
    });

    function loginRequired(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/signup-login');
    }

    // example @login_required usage
    app.get('/isloggedin-backend', loginRequired, function (req, res) {
        res.send('<div style="color:red;font-size:100px">YES</div>');
    });

    //views
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');


    //actions
    app.get('/logout', function(req, res) {
        res.redirect('/logout-backend');
    });
    app.post('/login', function(req, res) {
        res.redirect(307, '/login-backend');
    });
    app.post('/signup', function(req, res) {
        res.redirect(307, '/register-backend');
    });


    app.post('/edit-profile', function(req, res) {
        res.redirect(307, '/edit-profile-backend');
    });

    app.post('/edit-account', function(req, res) {
        res.redirect(307, '/edit-account-backend');
    });

    app.get('/search-public-gallery', function(req, res) {
        res.redirect('/public-gallery');
    });
    app.get('/search-gallery', function(req, res) {
        res.redirect('/gallery');
    });
    app.get('/subscribe', function(req, res) {
        res.redirect('/profile');
    });
    app.get('/unsubscribe', function(req, res) {
        res.redirect('/subscriptions');
    });
    app.get('/send-message', function(req, res) {
        res.redirect('/home');
    });
    app.get('/playback-mode', function(req, res) {
        res.render('playback-mode', { title: 'Playback Mode' });
    });


    //routes
    app.get('/', loginRequired, function(req, res) {
        res.render('index', { title: 'LineOnline' });
    });
    app.get('/signup-login', function(req, res) {
        res.render('signup-login', { title: 'Signup/Login', state: 'signedOut' });
    });
    app.get('/home', loginRequired, function(req, res) {
        res.render('home', { title: 'Home' });
    });
    app.get('/gallery', loginRequired, function(req, res) {
        res.render('gallery', { title: 'Gallery' });
    });
    app.get('/public-gallery', function(req, res) {
        res.render('public-gallery', { title: 'Gallery', state: 'signedOut' });
    });
    app.get('/your-tracks', loginRequired, function(req, res) {
        res.render('your-tracks', { title: 'Your Tracks' });
    });
    app.get('/profile', loginRequired, function (req, res) {
        visitUserProfile(req, res, req.user);
    });
    app.get('/profile/:id', loginRequired, visitProfile);
    app.get('/favorites', loginRequired, function(req, res) {
        res.render('favorites', { title: 'Favorites' });
    });
    app.get('/subscriptions', loginRequired, function(req, res) {
        res.render('subscriptions', { title: 'Subscriptions' });
    });
    app.get('/settings', loginRequired, function(req, res) {
        res.render('settings', { title: 'Settings' });
    });



    // Begin Rest API Routes
    app.get('/api/users/:id', getUserJson);
    app.get('/api/users/:id/profile', getProfileJson);
    app.get('/api/users/:id/collections', getCollectionsJson);

    app.get('/api/users/:id/favorites', function(req, res){
        res.json({
            "favorites": {
                "track1" : {
                    "id": "track_id",
                    "name": "track_name",
                    "thumbnail" : "track_thumbnail"
                }
            }
        });
    });

    app.get('/api/users/:id/subscriptions', getSubscriptions);

    // Update profile page
    app.post('/api/users/:id/profile', updateProfileJson);






}


