// tests will only pass for an initially empty database

// Begin with no data

require('./auth'); // registers dolan
require('./auth-errors');
require('./users-basic'); // registers bob
require('./tracks-basic'); // makes dolan's and bob's tracks
require('./track-edit');
require('./users-profile');
// TODO: gallery
// TODO: subscriptions
require('./subscriptions');
// TODO: favorites
// TODO: collections

// TODO: invitations
// TODO: collaboration (non-realtime)
// TODO: privacy
// TODO: conversations (non-realtime)

// TODO: account settings

// TODO: edge cases?
