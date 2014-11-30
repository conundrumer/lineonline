var express = require('express');

var auth = require('../controllers/auth');
var users = require('../controllers/users');
var tracks = require('../controllers/tracks');
var favorites = require('../controllers/favorites');
var subscriptions = require('../controllers/subscriptions');

var api = express.Router();

// subscriptions
api.route('/subscriptions')
    .get(auth.loginRequired, subscriptions.getSubscriptions);

api.route('/subscriptions/:user_id')
    .put(auth.loginRequired, subscriptions.addSubscription)
    .delete(auth.loginRequired, subscriptions.deleteSubscription);

// auth

api.route('/auth')
    .post(auth.login)
    .get(auth.loginRequired, auth.getCurrentUser)
    .delete(auth.loginRequired, auth.logout);

api.route('/auth/register')
    .post(auth.register);

// users

api.route('/users/:id')
    .get(users.getUserSnippet);

api.route('/users/:id/tracks')
    .get(users.getTracks);

// tracks

api.route('/tracks')
    .post(auth.loginRequired, tracks.makeTrack);

api.route('/tracks/:track_id')
    .get(tracks.getTrack)
    .put(tracks.editTrack)
    .delete(tracks.deleteTrack);

// profile
api.route('/users/:id/profile')
    .get(users.getProfile)
    .put(users.editProfile);

// favorites
api.route('/favorites/:track_id')
    .put(auth.loginRequired, favorites.addFavorite)
    .delete(auth.loginRequired, favorites.removeFavorite);
api.route('/favorites')
    .get(auth.loginRequired, favorites.getFavorites);


module.exports = function (app, passport) {
    app.use('/api', api);

    // example @login_required usage
    app.get('/isloggedin-backend', auth.loginRequired, function (req, res) {
        res.send('<div style="color:red;font-size:100px">YES</div>');
    });

    //views
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');

    // default routes to single page app
    app.get('*', function(req, res) {
        res.render('react-index');
    });
};
