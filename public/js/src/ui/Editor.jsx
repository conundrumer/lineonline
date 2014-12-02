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
            console.log('have track id');
            Actions.getFullTrack(this.props.params.trackId);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        console.log('this props: ', this.props.params.trackId)
        console.log('next props: ', nextProps.params.trackId)
        if (this.props.params.trackId !== nextProps.params.trackId
            && nextProps.params.trackId) {
            Actions.getFullTrack(nextProps.params.trackId);
        } else if (this.props.params.trackId !== nextProps.params.trackId) {
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
        console.log('creating a track!!!');
        console.log(unsavedTrackData);
    },
    handleUpdateTrack: function(trackMetaData) {
        var updatedTrackData = _.extend(this.state.data.track, trackMetaData)
        Actions.updateTrack(updatedTrackData);
        console.log('updating a track!!!');
        console.log(updatedTrackData);
    },
    handleUpdateScene: function(scene) {
        console.log('updating scene on server...')
        console.log(this.state.data.track.scene);
        Actions.updateTrack(this.state.data.track);
    },
    handleSaveSceneForFutureUpdate: function(scene) {
        console.log('saving scene data for future update...')
        var updatedTrack = _.extend(this.state.data.track, { scene: scene });
        this.setState({
            data: _.extend(this.state.data, { track: updatedTrack })
        });
    },
    handleInvite: function(e) {
        console.log('handling invite');
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

        return (
            <div className='main-content'>
                <Panel isEditor={true}>
                    <SaveModal
                        isModalHidden={this.state.isModalHidden}
                        onInvite={this.handleInvite}
                        onSave={saveHandler}
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
