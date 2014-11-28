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
            Actions.getFullTrack(this.props.params.trackId);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.params.trackId !== nextProps.params.trackId
            && nextProps.params.trackId) {
            Actions.getFullTrack(nextProps.params.trackId);
        }
    },
    handleCreateTrack: function(data) {
        // Actions.createTrack(data);
        console.log('creating a track!!!');
        console.log(data);
    },
    handleUpdateTrack: function(data) {
        // var updatedTrack = this.state.data.track;
        // updatedTrack.scene = scene;
        // Actions.updateTrack(this.props.params.trackId, updatedTrack);
        console.log('updating a track!!!');
        console.log(this.props.params.trackId);
        console.log(data);
    },
    render: function() {
        var EMPTY_SCENE = {
            next_point_id: 0,
            next_line_id: 0,
            points:{},
            lines:{}
        };

        var EMPTY_TRACK = {
            scene: EMPTY_SCENE,
            title: null,
            description: null,
            collaborators: null,
            invitees: null,
            tags: null,
            preview: null
        };

        var isBlank = this.props.params.trackId ? false : true;

        var handler = this.props.params.trackId ?
            this.handleUpdateTrack : this.handleCreateTrack;

        var scene = this.state.data.track ?
            this.state.data.track.scene : EMPTY_SCENE;

        var track = this.state.data.track ?
            this.state.data.track : EMPTY_TRACK;

        var DEFAULT_HANDLER = function(e){console.log(e)};
        return (
            <div className='main-content'>
                <Panel isEditor={true}>
                    <LineriderEditor
                        isBlank={isBlank}
                        initScene={scene}
                        onSave={handler}
                        track={track}
                    />
                    <Conversation />
                </Panel>
            </div>
        );
    }
});

module.exports = Editor;
