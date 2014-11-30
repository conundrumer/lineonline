var express = require('express');

var auth = require('../controllers/auth');
var users = require('../controllers/users');
var tracks = require('../controllers/tracks');
var invitations = require('../controllers/invitations');
var subscriptions = require('../controllers/subscriptions');

var api = express.Router();

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


// profile
api.route('/users/:id/profile')
    .get(users.getProfile)
    .put(users.editProfile);

// tracks

api.route('/tracks')
    .post(auth.loginRequired, tracks.makeTrack);

api.route('/tracks/:track_id')
    .get(tracks.getTrack)
    .put(tracks.editTrack)
    .delete(tracks.deleteTrack);

api.route('/tracks/:track_id/invitations')
    .get(auth.loginRequired, tracks.getInvitations);

api.route('/tracks/:track_id/invitations/:user_id')
    .put(auth.loginRequired, tracks.invite)
    .delete(auth.loginRequired, tracks.uninvite);


// invitations
api.route('/invitations')
    .get(auth.loginRequired, invitations.getInvitations);

api.route('/invitations/:track_id')
    .put(auth.loginRequired, invitations.accept)
    .delete(auth.loginRequired, invitations.decline);


// subscriptions
api.route('/subscriptions')
    .get(auth.loginRequired, subscriptions.getSubscriptions);

api.route('/subscriptions/:user_id')
    .put(auth.loginRequired, subscriptions.addSubscription)
    .delete(auth.loginRequired, subscriptions.deleteSubscription);


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
