var express = require('express');
function log(someString){
    console.log(someString);
}
// function here(){
//     var thisline = (new Error()).stack[1]
//     log(thisline);
// }

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

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Passport session setup.
// figure out how to findById alternative !!!!!
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(model, done) {
    log("serializing: " + model.get('id'));
  done(null, model.get('id'));
});

passport.deserializeUser(function(id, done) {
    log("DEserializing: " + id);
    User.where({id:id}).fetch().then(function(model) {
        done(null, model);
    }).catch(function (err) {
        console.error(err);
        done(err, null);
    });
});



// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // check also if the database had errors!
        log("Trying to authenticate someone 1.");
        User.where({username: username}).fetch().then(function(model){
            if (model === null) {
                console.log("This username did not exist!");
                return done(null, false, { message: 'Unknown user ' + username });
            }
            if (model.get('password') != password) {
                log("Incorrect password.");
                return done(null, false, { message: 'Invalid password'});
            }
            log("Correct password! Logging you in!");
            return done(null, model); // TODO: parse the model to something easier to work with
        }).catch(console.error);
    })
);




// testing what we can do with knex and bookshelf
knex.schema.dropTableIfExists('users').then(function() {
    return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.string('username', 100);
        t.string('password', 100);
        t.string('email', 100);
        t.string('description', 300);
        t.string('location', 100);

    });
// create user with password
}).then(function () {
    return User.forge({username:'delu',password:'yourmother'}).save().then(function(){
        console.log('created user "delu" with password "yourmother"');
    });
// dummy authentication
}).then(function () {


// change user password
}).then(function() {
    return User.where({username:'delu',password:'yourmother'}).fetch().then(function(model){
        console.log('before password: '+ model.get('password'));
        model.set({password: 'mymother'});
        return model.save(); // save/return async promises
    });
// password changed
}).then(function() {
    return User.where({username:'delu'}).fetch().then(function(model){
        console.log('after password: '+ model.get('password'));
    });
// delete users
}).then(function() {
    // return User.where({username:'delu'}).destroy();
// check to see delu has been deleted
// }).then(function() {
//     return User.where({username:'delu'}).fetch().then(function(model){
//         if (model === null) {
//             console.log("delu has been destroyed");
//         }
//     });
// add other elements to users
}).then(function() {

// destroy the table
}).then(function() {
    // knex.schema.dropTable('users');
});

// Start the app / server
var app = express();
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

// Start the database and authentication
// app.configure(function() {
    // ALL OF THESE NO LONGER BUNDLED WITH EXPRESS
    // app.use(express.logger());
    var cookieParser = require('cookie-parser');
    app.use(cookieParser());
    var bodyParser = require('body-parser');
    // need to specify which parsers we want to use
    app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(express.methodOverride());
    var session = require('express-session');
    app.use(session({ secret: 'supa secret homies!', resave: true, saveUninitialized: true }));
    app.set('bookshelf', bookshelf);

    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(app.router); // DEPRECATED

// });




function register(req, res){
    username = req.body.username
    password = req.body.password
    // log(JSON.stringify(req.body));

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
            User.forge({username:username, password:password}).save().then(function(){
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
            res.send(
                '<h1>' + model.get('username') + '</h1>' +
                '<p> Location: ' + model.get('location') + '</p>' +
                '<p> Description: ' + model.get('description') + '</p>' +
                '<p> Email: ' + model.get('email') + '</p>'

                )
        }
    });



}

function editProfile(req, res){
    email = req.body.email
    location = req.body.location
    description = req.body.description

    model = req.user
    // log(JSON.stringify(req.body));

    if (email != ""){
        model.set({email: email});
    }

    if (location != ""){
        model.set({location: location});
    }

    if (description != ""){
        model.set({description: description});
    }

    model.save();
    res.redirect('/profile-backend/'+model.get('id'));

}



// These are the urls we route to
// req = request, res = response
app.get('/-backend', function(req, res) {
    res.send('<div style="color:red;">Hello ' + (req.user ? req.user.get('username') : 'it') + '!</div>');
});
app.get('/login-backend', function(req,res){
    res.sendFile(__dirname + '/auth.html');

});
app.get('/register-backend', function(req,res){
    log("Get register.");
    res.sendFile(__dirname + '/register.html');

});
app.get('/edit-profile-backend', loginRequired, function(req,res){
    log("Get edit-profile.");
    res.sendFile(__dirname + '/edit-profile.html');

});

app.get('/profile-backend/:id', loginRequired, visitProfile);
app.get('/faillogin-backend', function(req,res){
    res.sendFile(__dirname + '/nologin.html');
});
// app.post('/login', function(req, res){
//     log("User is: " + req.body.username);
// });

app.post('/login-backend',
    passport.authenticate('local', { successRedirect: '/home',
                                   failureRedirect: '/signup-login',
                                   failureFlash: false })
);
app.post('/register-backend', register);
app.post('/edit-profile-backend', loginRequired, editProfile);

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
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//middleware
// app.use(express.logger('dev')); //log incoming requests to console
app.use(express.static(__dirname + '/public')); //serve static files

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
app.get('/profile', loginRequired, function(req, res) {
    res.render('profile', { title: 'Profile' });
});
app.get('/favorites', loginRequired, function(req, res) {
    res.render('favorites', { title: 'Favorites' });
});
app.get('/subscriptions', loginRequired, function(req, res) {
    res.render('subscriptions', { title: 'Subscriptions' });
});
app.get('/settings', loginRequired, function(req, res) {
    res.render('settings', { title: 'Settings' });
});


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
