var users = require('../controllers/users');
var tracks = require('../controllers/tracks');

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    function loginRequired(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.status(401).send(); // send 401 status instead
    }

    // These are the urls we route to
    // req = request, res = response
    // app.get('/-backend', function(req, res) {
    //     res.send('<div style="color:red;">Hello ' + (req.user ? req.user.get('username') : 'it') + '!</div>');
    // });
    // app.get('/login-backend', function(req,res){
    //     res.sendFile(__dirname + '/auth.html');

    // });
    // app.get('/register-backend', function(req,res){
    //     console.log("Get register.");
    //     res.sendFile(__dirname + '/register.html');

    // });
    // app.get('/edit-profile-backend', loginRequired, function(req,res){
    //     console.log("Get edit-profile.");
    //     res.sendFile(__dirname + '/edit-profile.html');

    // });

    // app.get('/profile-backend/:id', loginRequired, users.visitProfile);
    // app.get('/faillogin-backend', function(req,res){
    //     res.sendFile(__dirname + '/nologin.html');
    // });

    // app.post('/login-backend', passport.authenticate('local', { successRedirect: '/home',
    //                                    failureRedirect: '/signup-login',
    //                                    failureFlash: false })

    // );
    // app.post('/register-backend', users.register);
    // app.post('/edit-profile-backend', loginRequired, users.editProfile);
    // app.post('/edit-account-backend', loginRequired, users.editAccount);

    // app.get('/logout-backend', function(req, res){
    //   req.logout();
    //   res.redirect('/signup-login');
    // });


    // example @login_required usage
    app.get('/isloggedin-backend', loginRequired, function (req, res) {
        res.send('<div style="color:red;font-size:100px">YES</div>');
    });

    //views
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');


    //actions
    // app.get('/logout', function(req, res) {
    //     res.redirect('/logout-backend');
    // });
    // app.post('/login', function(req, res) {
    //     res.redirect(307, '/login-backend');
    // });
    // app.post('/signup', function(req, res) {
    //     res.redirect(307, '/register-backend');
    // });


    // app.post('/edit-profile', function(req, res) {
    //     res.redirect(307, '/edit-profile-backend');
    // });

    // app.post('/edit-account', function(req, res) {
    //     res.redirect(307, '/edit-account-backend');
    // });

    // app.get('/search-public-gallery', function(req, res) {
    //     res.redirect('/public-gallery');
    // });
    // app.get('/search-gallery', function(req, res) {
    //     res.redirect('/gallery');
    // });
    // app.get('/subscribe', function(req, res) {
    //     res.redirect('/profile');
    // });
    // app.get('/unsubscribe', function(req, res) {
    //     res.redirect('/subscriptions');
    // });
    // app.get('/send-message', function(req, res) {
    //     res.redirect('/home');
    // });
    // app.get('/playback-mode', function(req, res) {
    //     res.render('playback-mode', { title: 'Playback Mode' });
    // });


    //routes
    // app.get('/', loginRequired, function(req, res) {
    //     res.render('index', { title: 'LineOnline' });
    // });
    // app.get('/signup-login', function(req, res) {
    //     res.render('signup-login', { title: 'Signup/Login', state: 'signedOut' });
    // });
    // app.get('/home', loginRequired, function(req, res) {
    //     res.render('home', { title: 'Home' });
    // });
    // app.get('/gallery', loginRequired, function(req, res) {
    //     res.render('gallery', { title: 'Gallery' });
    // });
    // app.get('/public-gallery', function(req, res) {
    //     res.render('public-gallery', { title: 'Gallery', state: 'signedOut' });
    // });
    // app.get('/your-tracks', loginRequired, function(req, res) {
    //     res.render('your-tracks', { title: 'Your Tracks' });
    // });
    // app.get('/profile', loginRequired, function (req, res) {
    //     users.visitUserProfile(req, res, req.user);
    // });
    // app.get('/profile/:id', loginRequired, users.visitProfile);
    // app.get('/favorites', loginRequired, function(req, res) {
    //     res.render('favorites', { title: 'Favorites' });
    // });
    // app.get('/subscriptions', loginRequired, function(req, res) {
    //     res.render('subscriptions', { title: 'Subscriptions' });
    // });
    // app.get('/settings', loginRequired, function(req, res) {
    //     res.render('settings', { title: 'Settings' });
    // });





    // Begin Rest API Routes
    app.get('/api/auth', loginRequired, users.getCurrentUser);
    app.post('/api/auth', users.login);
    app.delete('/api/auth', loginRequired, users.logout);
    app.post('/api/auth/register', users.doRegister);

    app.get('/api/users/:id', users.getUserJson);
    app.get('/api/users/:id/profile', users.getProfileJson);
    app.get('/api/users/:id/collections', users.getCollectionsJson);
    app.get('/api/users/:id/tracks/:track_id', tracks.getTrack);


    app.get('/api/users/:id/favorites', users.getFavoritesJson);

    app.get('/api/users/:id/subscriptions', users.getSubscriptions);

    // Update profile page
    app.put('/api/users/:id/profile', loginRequired, users.updateProfileJson);
    app.post('/api/users/:user_id/tracks/', loginRequired, users.createTrack);

    app.post('/api/tracks', loginRequired, tracks.makeTrack);
    app.get('/api/tracks/:track_id', tracks.getTrack);

    // default routes to single page app
    app.get('*', function(req, res) {
        res.render('react-index');
    });


}


