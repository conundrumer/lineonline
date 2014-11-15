

function register(req, res){
    username = req.body.username
    password = req.body.password
    email = req.body.email
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
        description: model.get('description')
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
        model.set({description: about});
    }

    model.save();
    res.redirect('/profile/'+model.get('id'));

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
    // app.post('/login', function(req, res){
    //     console.log("User is: " + req.body.username);
    // });

    app.post('/login-backend',
        passport.authenticate('local', { successRedirect: '/home',
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
        //res.send('<div style="color:red;">Hello World!</div>');
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
}
