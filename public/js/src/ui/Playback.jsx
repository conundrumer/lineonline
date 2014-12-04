var React = require('react/addons');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var TrackStore = require('../stores/track');

//UI Components
var Panel = require('./Panel.jsx');
var Icon = require('./Icon.jsx');
var MediaIcons = require('./MediaIcons.jsx');

//Linerider
var Display = require('../linerider/Display.jsx');

var Playback = React.createClass({
    mixins: [
        Reflux.listenTo(TrackStore, 'onDataChanged'),
        Navigation
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });

    },
    getInitialState: function() {
        return {
            data: TrackStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        if (this.props.params.trackId) {
            Actions.getTrack(this.props.params.trackId);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        if ((this.props.params.trackId !== nextProps.params.trackId)
            && nextProps.params.trackId) {
            Actions.getTrack(nextProps.params.trackId);
        }
    },
    onClosePlayback: function() {
        this.goBack();
    },
    render: function() {
        return (
            <div className='main-content'>
                {this.state.data.track ?
                    <Panel isPlayback={true}>
                        <div onClick={this.onClosePlayback}>
                            <Icon class='preview-icon' icon='fullscreen-exit' />
                        </div>
                        <MediaIcons />
                        <Display scene={this.state.data.track.scene} />
                    </Panel>
                    : null
                }
            </div>
        );
    }
});

module.exports = Playback;
