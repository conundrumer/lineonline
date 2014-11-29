var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var EditorStore = require('../stores/editor');

//UI Components
var Conversation = require('./Conversation.jsx');
var Panel = require('./Panel.jsx');
var Footer = require('./Footer.jsx');

//Linerider
var LineriderEditor = require('../linerider/Editor.jsx');

var Editor = React.createClass({
    mixins: [
        Reflux.listenTo(EditorStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: EditorStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.params.trackId) {
            console.log('have track id');
            Actions.getFullTrack(this.props.params.trackId);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.params.trackId !== nextProps.params.trackId
            && nextProps.params.trackId) {
            Actions.getFullTrack(nextProps.params.trackId);
        }
    },
    handleCreateTrack: function(unsavedTrackData) {
        // Actions.createTrack(unsavedTrackData);
        console.log('creating a track!!!');
        console.log(unsavedTrackData);
    },
    handleUpdateTrack: function(fullTrackData) {
        console.log('updating a track!!!');
        // console.log(this.props.params.trackId);
        console.log(fullTrackData);
    },
    render: function() {
        var EMPTY_SCENE = {
            next_point_id: 0,
            next_line_id: 0,
            points: {},
            lines: {}
        };

        var DEFAULT_PREVIEW = {
            top: 0,
            left: 0,
            bottom: 360,
            right: 480
        };

        var EMPTY_TRACK = {
            scene: EMPTY_SCENE,
            title: '',
            description: '',
            collaborators: [],
            invitees: [],
            tags: [],
            preview: DEFAULT_PREVIEW
        };

        var handler, track, scene;

        if (this.state.data.track) {
            handler = this.handleUpdateTrack;
            scene = this.state.data.track.scene;
            track = this.state.data.track;
        } else {
            handler = this.handleCreateTrack;
            scene = EMPTY_SCENE;
            track = EMPTY_TRACK;
        }

        return (
            <div className='main-content'>
                <Panel isEditor={true}>
                    <LineriderEditor
                        initScene={scene}
                        initTrack={track}
                        handleSave={handler}
                    />
                    <Conversation />
                </Panel>
            </div>
        );
    }
});

module.exports = Editor;
