var Reflux = require('reflux');
var request = require('superagent');
var Data = require('./store');
var StatusTypes = require('status-types');

var Actions = Reflux.createActions([
    //auth
    'getCurrentUser',
    'login',
    'logout',
    'signup',

    //profile
    'getProfile',
    'getTrackSnippets',
    'getFeaturedTrack',
    // 'getCollections',

    //home
    'getInvitations',
    'getYourTracks',
    'getCollaborations',

    'acceptInvitation',
    'rejectInvitation',
    'deleteTrack',
    'leaveCollaboration',
    //see 'getCollections'

    //editor
    'getFullTrack',
    'getConversation',
    'updateTrack',
    'createTrack',

    //gallery
    'getGallery',

    //favorites
    'getFavorites',

    //subscriptions
    'getSubscriptions'

    //settings
    //see 'getProfile'

]);

module.exports = Actions;
