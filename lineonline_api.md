# LineOnline API
LineOnline API is an internal API for LineOnline. It serves the majority of content and functionalities on the LineOnline website. All content types are application/json unless otherwise specified. All URL roots are from `/api`

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
Retrieves the user with this id.

+ Response 200

    [User][]

## Profile [/users/{id}/profile]
### GET
### Update Profile [PUT]
Only current user can update her own profile. Also involves reordering collections

## Favorites [/users/{id}/favorites]
Track collections.

### GET
+ Response 200

    [Track Collection][]

## Favorited Track [/users/{id}/favorites/{trackid}]
Only corresponding user can add/remove favorites.
### GET
### Add to favorites [PUT]
### Remove from favorites [DELETE]

## Subscriptions [/users/{id}/subscriptions]
User collections.
### GET

## Subscribee [/users/{id}/subscriptions/{subid}]
Only corresponding user can add/remove subscriptions.
### GET
### Subscribe [PUT]
### Unsubscribe [DELETE]

## User Collections [/users/{id}/collections]
### GET
### Make New Collection [POST]

## User Collection [/users/{id}/collections/{colid}]
### GET
### Update Collection [PUT]
Also involves reordering tracks
### Remove Collection [DELETE]

## User Collection Track [/users/{id}/collections/{colid}/{trackid}]
Only corresponding user can add/remove subscriptions.
### GET
### Add to Collection [PUT]
### Remove from Collection [DELETE]

## Account Settings [/settings]
Only available for logged in users
### GET
### Update Settings [PUT]

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
