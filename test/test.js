// tests will only pass for an initially empty database

// Begin with no data

require('./auth'); // registers dolan
require('./auth-errors'); // registers bob
require('./users-basic');
require('./tracks-basic'); // makes dolan's and bob's tracks

// TODO: track editing
require('./users-profile');
// TODO: gallery
// TODO: subscriptions
// TODO: favorites
// TODO: collections

// TODO: invitations
// TODO: collaboration (non-realtime)
// TODO: privacy
// TODO: conversations (non-realtime)

// TODO: account settings

// TODO: edge cases?
