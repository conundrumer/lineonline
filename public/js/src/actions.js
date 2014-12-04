var Reflux = require('reflux');

// you can split this up
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
    'newTrack',
    'getFullTrack',
    'getConversation',
    'updateTrack',
    'createTrack',
    'addInvitee',
    'addInvitees',
    'addCollaborators',
    'getInvitees',
    'getCollaborators',
    'openEditorSession',
    'closeEditorSession',
    'emitAddLine',
    'emitRemoveLine',
    // 'getInvitee',

    //gallery
    // 'getGallery',
    'getNewTracks',
    'getHotTracks',
    'getTopTracks',

    //favorites
    'getFavorites',
    'addFavorite',
    'removeFavorite',

    //subscriptions
    'getSubscriptions',
    'addSubscription',
    'removeSubscription',

    //settings
    //current user
    'getCurrentProfile',
    'updateCurrentProfile',
    'updateEmail',
    'updatePassword',

    //playback
    'getTrack'

]);

module.exports = Actions;
