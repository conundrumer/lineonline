# LineOnline API
LineOnline API is an internal API for LineOnline. It serves the majority of content and functionalities on the LineOnline website. All content types are application/json unless otherwise specified.

# Group Auth
Resources for registration, authentication, and sessions.

## Authentication [/auth]
Endpoint for User authentication and sessions. Cookies are involved. It would be nice to encrypt these connections too.

### GET
Retreive the currently logged in user.

+ Response 200

    [User][]

### Login [POST]
+ Request

        {
            "username": "delu",
            "password": "mymother"
        }

+ Response 200

    [User][]

### Logout [DELETE]
+ Response 205

## Registration [/auth/register]
Endpoint for User registration. Guests should be able to register and be *immediately logged in* following registration in order to immediately save tracks on the server, though email verification may be necessary to prevent spambots.

### Register [POST]
Returns the newly created User, going by the above design decision. Since this method also logs in the User, this method also sets cookies.

+ Request

        {
            "username": "delu",
            "password": "mymother"
        }

+ Response 201

    [User][]

# Group User
Resources based around users.

## User [/users/{id}]
Attributes:
- id
- name
- avatar_url

*id* is assigned by the API at creation.

+ Parameters

    + id (number) ... ID of the User

+ Model

    + Body

            {
                "_links": {
                    "self": { "href": "/users/42" },
                    "profile": { "href": "/users/42/profile" },
                    "favorites": { "href": "/users/42/favorites" },
                    "subscriptions": { "href": "/users/42/subscriptions" },
                    "collections": { "href": "/users/42/collections"},
                    "tracks": { "href": "/tracks?user=42"},
                },
                "id": 42,
                "name": "delu",
                "avatar_url": "http://www.example.com/avatar.png"
            }

### GET
+ Response 200

    [User][]

## Account Settings [/settings]
Only available for logged in users

### GET
what should tihs return?

### Update Settings [PUT]
+ Request
    {
        current_password: "mymother",
        new_password: "yourmother",
        new_password_confirm: "yourmother"
    }
+ Response 205

## User Collection [/users{?q}]
The User Collection embeds users.

+ Attributes
- total

+ Model

    + Body
            {
                "_links": {
                    "self": { "href": "/users" }
                },
                "_embedded": {
                    "users": [
                        {
                            "_links": {
                                "self": { "href": "/users/42" },
                                "profile": { "href": "/users/42/profile" },
                                "favorites": { "href": "/users/42/favorites" },
                                "subscriptions": { "href": "/users/42/subscriptions" },
                                "collections": { "href": "/users/42/collections"},
                                "tracks": { "href": "/tracks?user=42"},
                            },
                            "id": 42,
                            "name": "delu",
                            "avatar_url": "http://www.example.com/avatar.png"
                        }
                    ]
                },
                "total": 1
            }

### GET
+ Parameters
    + q (string) ... not sure

+ Response 200

    [User Collection]

## Profile [/users/{id}/profile]
A user profile contains more information about this particular user.

Attributes:
- location
- about
- avatar_url

+ Parameters

    + id (number) ... ID of the User

+ Model

    + Body

        {
            "_links": {
                "self": { "href": "/users/42/profile" },
                "user": { "href": "/users/42" }
            },
            "location": "NYC",
            "about": "i am delu",
            "avatar_url": "http://www.example.com/avatar.png"
        }

### GET
+ Response 200

    [Profile][]

### Update Profile [PUT]
Only current user can update her own profile.

+ Request

        {
            "location": "notNYC",
            "about": "i am not delu",
            "avatar_url": "http://www.example.com/notavatar.png"
        }

+ Response 200

    [Profile][]

## Favorites [/users/{id}/favorites]
User favorited tracks are track collections.

### GET
+ Response 200

    [Track Collection][]

## Favorited Track [/users/{id}/favorites/{trackid}]
A track that this user favorited. Only corresponding user can add/remove favorites.

+ Parameters

    + trackid (number) ... ID of the favorited track

### GET
+ Response 200

    [Track][]

### Add to favorites [PUT]
+ Response 204

### Remove from favorites [DELETE]
+ Response 204

## Subscriptions [/users/{id}/subscriptions]
A collection of users that this user is subscribed to.

### GET
+ Response 200

    [User Collection][]

## Subscribee [/users/{id}/subscriptions/{subid}]
A user that this user is subscribed to. Only corresponding user can add/remove subscriptions.

### GET
+ Response 200

    [User][]

### Subscribe [PUT]
+ Response 205

### Unsubscribe [DELETE]
+ Response 205

## User Track Collections [/users/{id}/collections]
A collection of track collections

+ Model

    + Body

            {
                "_links": {
                    "self": { "href": "/users/42/collections" },
                    "user": { "href": "/users/42" }
                },
                "_embedded": {
                    "collections": [
                        {
                            stuffcolelciotns
                        }
                    ]
                },
                "total": 1
            }

### GET
+ Response 200

### Make New Collection [POST]

## User Track Collection [/users/{id}/collections/{colid}]
### GET
### Update Collection [PUT]
Also involves reordering tracks
### Remove Collection [DELETE]

## User Collection Track [/users/{id}/collections/{colid}/{trackid}]
Only corresponding user can add/remove subscriptions.
### GET
### Add to Collection [PUT]
### Remove from Collection [DELETE]

# Group Tracks
Resources based around tracks

## Track Collection [/tracks{?user&q}]
### GET
### Add Track to Server [POST]
Need to be logged in

## Track [/tracks/{id}]
### GET
### Update Track [PUT]
Need to own this track
### Remove Track from Server [DELETE]
Need to own this track

## Conversation [/tracks/{id}/convo{?start_time}]
### GET
### Post message [POST]
