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
        Navigation,
        CurrentPath
    ],
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
        return {
            data: EditorStore.getDefaultData(),
            isModalHidden: true
        }
    },
    componentWillMount: function() {
        if (this.props.params.trackId) {
            Actions.getFullTrack(this.props.params.trackId);
            Actions.getInvitees(this.props.params.trackId);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        // console.log('this props: ', this.props.params.trackId)
        // console.log('next props: ', nextProps.params.trackId)
        if (this.props.params.trackId !== nextProps.params.trackId
            && nextProps.params.trackId) {
            console.log('On Existing Editor')
            Actions.getFullTrack(nextProps.params.trackId);
            Actions.getInvitees(this.props.params.trackId);
        } else if (this.props.params.trackId !== nextProps.params.trackId) {
            console.log('On New Editor')
            this.setState({
                data: EditorStore.getDefaultData()
            });
        }
        // else if (this.props.params.trackId !== nextProps.params.trackId) {
        //     this.setState({
        //         data: _.extend(this.state.data.track, {  })
        //     })

        //     track: _.extend(this.state.data.track, { title: event.target.value })
        // }
    },
    handleOpenModal: function(e) {
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
        // Actions.addInvitees(unsavedTrackData);

        console.log('creating a track!!!');
    },
    handleUpdateTrack: function(trackMetaData) {
        var updatedTrackData = _.extend(this.state.data.track, trackMetaData)
        Actions.updateTrack(updatedTrackData);
        // Actions.addInvitees(updatedTrackData);

        console.log('updating a track!!!');
    },
    handleUpdateScene: function(scene) {
        console.log('updating scene on server...')
        var updatedTrack = _.extend(this.state.data.track, { scene: scene });
        this.setState({
            data: _.extend(this.state.data, { track: updatedTrack })
        });
        Actions.updateTrack(this.state.data.track);
    },
    handleSaveSceneForFutureUpdate: function(scene) {
        console.log('saving scene data for future update...')
        var updatedTrack = _.extend(this.state.data.track, { scene: scene });
        this.setState({
            data: _.extend(this.state.data, { track: updatedTrack })
        });
    },
    handleInvite: function(user) {
        if (this.props.params.trackId) {
            Actions.addInvitee(this.props.params.trackId, user);
        } else {
            alert('You must save your track before inviting anyone!');
        }
    },
    render: function() {
        var saveHandler, isNewTrack, sceneUpdateHandler;
        if (this.props.params.trackId) {
            saveHandler = this.handleUpdateTrack;
            sceneUpdateHandler = this.handleUpdateScene;
            isNewTrack = false
        } else {
            saveHandler = this.handleCreateTrack;
            sceneUpdateHandler = this.handleSaveSceneForFutureUpdate;
            isNewTrack = true
        }

        // console.log(this.state.data.track.scene);

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
                        initScene={this.state.data.track.scene}
                        isNewTrack={isNewTrack}
                        onOpenModal={this.handleOpenModal}
                        onUpdateScene={sceneUpdateHandler}
                    />
                    <Conversation />
                </Panel>
            </div>
        );
    }
});

module.exports = Editor;
