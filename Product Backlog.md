# Product Backlog

## Terminology / Introduction
  Here we define the terminology used for our Line Rider editor, which is the underpinning feature of our web application. The sledding dude’s name is **Bosh**. When we are in edit mode, one or more users will collaborate in real-time to work on a **track**. The track is the project that holds a **scene**, which is a canvas (not <canvas>) on which collaborators will add or remove **lines**. Some lines are **solid lines** that Bosh can interact with, whether that means by riding on or colliding with it (**normal**), accelerating on it (**acceleration**). Some lines are simply **scenery lines**, meaning they are non-collidable, used for the purpose of background / art. From the track, you can **playback** the scene to simulate the Bosh’s journey and, **save** the track when satisfied. They communicate constantly in real-time using the **Conversation** feature, which is a chatroom sidebar in edit mode.

  **LineOnline**, our Line Rider collaboration website, allows users to create **profiles**, on which they can **publish** their tracks and organize them into **collections**, keep them private as works in progress, **favorite** particular tracks, and **subscribe** to their peers. They can also personalize these profiles with an avatar, location, description, and manage the expected account settings. The **Gallery** exhibits all published tracks and provides **search** functionality according to **tags** attached to tracks. 

  LineOnline strives to be a tool for creating, collaborating, and sharing creations, not a tool for social networking, so we actively avoid features like posting, commenting, and private messaging. We also put careful thought into the design of our front page so that it performs three functions: we first have a masthead playing a featured track that exhibits how creative and fun the LineRider application can be. Then, right underneath, we have an already open editor, allowing for instant creation. You only need one click to start making something! Below the editor, we have a banner that shows a snippet of the gallery, allowing for a quick jumping point into exploring what others have created and finding inspiration. 


## Functionality
### Track
On the client side, the track has an editor with a set of tools for editing the track. The track also has playback controls to watch the track, using a physics simulator. The track is rendered using some graphics library. Only editing the track affects the server.
* Add/remove line: When the user adds/removes a line, the browser synchronizes the update with the server. Tools for adding/removing not specified in this section.
* Save: Saves the current scene to the server.
* Edit metadata: Edits the title, description, and tags
* Edit privacy: Changes the privacy of a track to public (visible on gallery), unlisted (only people with the link can see), and private (only collaborators can see), like on Youtube

### Collaboration
* Manage collaborators: If the user is the owner of a track, the user can invite and remove collaborators
* Chat with collaborators: Users will be able to send messages to each other in real-time, using the built-in chat room in the editor.

### User
* Authorization: A guest can register or login or invoke “forgot username/password”
* Account management: A user can change her password or email.
* Edit profile info: A user can change her avatar and edit her profile description
* Manage collections: Similar to playlists on Youtube, but with tracks instead. A user can create/remove collections, and in those collections, add/remove/order tracks.
* Edit collections: A user can change the order and visibility of collections in their profile.

### Interactions
* Favorite: A user can add/remove a track to her favorites.
* Subscribe: A user, Alice, can subscribe to another user, Bob, so that she can view his new tracks in the subscriptions section of the gallery. Alice can also unsubscribe.
* Search: A user can query the gallery for tracks with a given tag/timeframe
