var express = require('express');

var auth = require('../controllers/auth');
var users = require('../controllers/users');
var tracks = require('../controllers/tracks');
var invitations = require('../controllers/invitations');
var collaborations = require('../controllers/collaborations');
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

api.param('user_id', users.getByID);

api.route('/users/:user_id')
    .get(users.getUserSnippet);

api.route('/users/:user_id/tracks')
    .get(users.getTracks);


// profile
api.route('/users/:user_id/profile')
    .get(users.getProfile)
    .put(users.editProfile);

// tracks

api.param('track_id', tracks.getByID);

api.route('/tracks')
    .post(auth.loginRequired, tracks.makeTrack);

api.route('/tracks/:track_id')
    .get(tracks.getTrack)
    .put(auth.loginRequired, tracks.ownershipRequired, tracks.editTrack)
    .delete(auth.loginRequired, tracks.ownershipRequired, tracks.deleteTrack);

// invitations
api.use('/invitations', auth.loginRequired);

api.route('/invitations')
    .get(invitations.getInvitations);

api.route('/invitations/:track_id')
    .put(invitations.accept)
    .delete(invitations.decline);

api.use('/tracks/:track_id/invitations', auth.loginRequired);

api.route('/tracks/:track_id/invitations')
    .get(tracks.getInvitations);

api.route('/tracks/:track_id/invitations/:user_id')
    .put(tracks.ownershipRequired, users.noSelfReference, tracks.invite)
    .delete(tracks.ownershipRequired, users.noSelfReference, tracks.uninvite);

// collaborations
api.use('/collaborations', auth.loginRequired);

api.route('/collaborations')
    .get(collaborations.getCollaborations);

api.route('/collaborations/:track_id')
    .delete(collaborations.leaveCollaboration);

api.use('/tracks/:track_id/collaborators', auth.loginRequired);

api.route('/tracks/:track_id/collaborators')
    .get(tracks.getCollaborators);

api.route('/tracks/:track_id/collaborators/:user_id')
    .delete(tracks.ownershipRequired, users.noSelfReference, tracks.removeCollaborator);

// subscriptions
api.use('/subscriptions', auth.loginRequired);

api.route('/subscriptions')
    .get(subscriptions.getSubscriptions);

api.route('/subscriptions/:user_id')
    .put(subscriptions.addSubscription)
    .delete(subscriptions.deleteSubscription);


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
