var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var CurrentPath = Router.CurrentPath;
var Link = Router.Link;
var Reflux = require('reflux');
var _ = require('underscore');

//Actions
var Actions = require('../actions');

//Data Stores
var EditorStore = require('../stores/editor');
var RealtimeEditorStore = require('../stores/realtime-editor');

//UI Components
var Conversation = require('./Conversation.jsx');
var Panel = require('./Panel.jsx');
var Footer = require('./Footer.jsx');
var SaveModal = require('./SaveModal.jsx');

//Linerider
var LineriderEditor = require('../linerider/Editor.jsx');

var Editor = React.createClass({
    mixins: [
        Reflux.listenTo(EditorStore, 'onDataChanged'),
        Reflux.listenTo(RealtimeEditorStore, 'onSessionUpdate'),
        Navigation,
        CurrentPath
    ],
    onSessionUpdate: function(sync) {
        console.log(sync === 0 ? "Syncronized" : sync === -1 ? "Not connected" : "Syncronizing..." )
        return;
    },
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });

        if (this.getCurrentPath() === '/editor'
            && this.state.data.track
            && this.state.data.track.track_id) {
            console.log('transitioning the page...');
            this.transitionTo('/edit/'  + this.state.data.track.track_id);
        }
    },
    getInitialState: function() {
        var data = EditorStore.loadLocalTrack();

        return {
            data: data,
            isModalHidden: true
        }
    },
    componentWillMount: function() {
        if (this.props.params.trackId) {
            this.loadTrack(this.props.params.trackId);
        } else {

        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (!this.props.params.trackId && nextProps.params.trackId) {
            console.log('A new track is being created/loaded.');
            this.loadTrack(nextProps.params.trackId);
            this.setState({ isModalHidden: true });
            return;
        }
        if (this.props.params.trackId !== nextProps.params.trackId) {
            if (nextProps.params.trackId) {
                console.log('Switching tracks', this.props.params.trackId, nextProps.params.trackId);
                this.loadTrack(nextProps.params.trackId);
                this.setState({ isModalHidden: true });
            } else {
                console.log('Switching to empty track');
                Actions.closeEditorSession();
                Actions.newTrack();
                this.setState({ isModalHidden: true });
            }
        }
    },
    componentWillUnmount: function() {
        Actions.closeEditorSession();
    },
    loadTrack: function(trackId) {
        if (this.state.data.track.track_id !== trackId) {
            // load or switch tracks
            Actions.getFullTrack(trackId);
        }
        Actions.openEditorSession(trackId);
    },
    handleOpenModal: function(scene) {
        var newData = this.state.data;
        newData.track.scene = scene;
        this.setState({
            data: newData
        });

        if (this.props.params.trackId) {
        }

        if (this.state.isModalHidden) {
            this.setState({
                isModalHidden: !this.state.isModalHidden
            });
        }
    },
    handleCloseModal: function(e) {
        if (!this.state.isModalHidden) {
            this.setState({
                isModalHidden: !this.state.isModalHidden
            });
        }
    },
    handleCreateTrack: function(trackMetaData) {
        var unsavedTrackData = _.extend(this.state.data.track, trackMetaData)
        Actions.createTrack(unsavedTrackData);

        console.log('creating a track!!!');
    },
    handleUpdateTrack: function(trackMetaData) {
        var updatedTrackData = _.extend(this.state.data.track, trackMetaData)
        Actions.updateTrack(updatedTrackData);
        // Actions.addInvitees(updatedTrackData);

        console.log('updating a track!!!');
    },
    handleInvite: function(user) {
        if (this.props.params.trackId) {
            console.log('adding invitee!');
            Actions.addInvitee(this.props.params.trackId, user);
        } else {
            alert('You must save your track before inviting anyone!');
        }
    },
    handleNewTrack: function() {
        Actions.newTrack();
        if (this.getCurrentPath() !== '/editor'){
            this.transitionTo('/editor');
        }
    },
    render: function() {
        var saveHandler, isNewTrack; //, sceneUpdateHandler;
        if (this.props.params.trackId) {
            saveHandler = this.handleUpdateTrack;
            // sceneUpdateHandler = this.handleUpdateScene;
            isNewTrack = false
        } else {
            saveHandler = this.handleCreateTrack;
            // sceneUpdateHandler = this.handleSaveSceneForFutureUpdate;
            isNewTrack = true
        }

        return (
            <div className='main-content'>
                <Panel isEditor={true}>
                    <SaveModal
                        isModalHidden={this.state.isModalHidden}
                        onSave={saveHandler}
                        onInvite={this.handleInvite}
                        onCloseModal={this.handleCloseModal}
                        track={this.state.data.track}
                    />
                    <LineriderEditor
                        userID={this.props.currentUser && this.props.currentUser.user_id || 0}
                        isNewTrack={isNewTrack}
                        onSaveSetting={this.handleOpenModal}
                        onNewTrack={this.handleNewTrack}
                        onAddLine={Actions.emitAddLine}
                        onRemoveLine={Actions.emitRemoveLine}
                    />
                    <Conversation />
                </Panel>
            </div>
        );
    }
});

module.exports = Editor;
