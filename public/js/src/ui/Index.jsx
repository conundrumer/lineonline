var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
var IndexStore = require('../stores/index');

//UI Components
var Gallery= require('./Gallery.jsx');
var Panel = require('./Panel.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var ScrollDivider = require('./ScrollDivider.jsx');
var Footer = require('./Footer.jsx');
// var Editor = require('./Editor.jsx');

var Display = require('../linerider/Display.jsx');

var Index = React.createClass({
    trackId: 1,
    mixins: [
        Reflux.listenTo(IndexStore, 'onDataChanged')
    ],
    onDataChanged: function(newData) {
        this.setState({
            data: newData
        });
    },
    getInitialState: function() {
        return {
            data: IndexStore.getDefaultData()
        }
    },
    componentWillMount: function() {
        Actions.getGlobalFeaturedTrack(this.trackId);
    },
    componentWillReceiveProps: function(nextProps) {
        Actions.getGlobalFeaturedTrack(this.trackId);
    },
    render: function() {
        return (
            <div className='main-content'>
                <Panel isMasthead={true} id='masthead-panel'>
                    {this.state.data.featuredTrack ?
                        <div>
                            <div>{this.state.data.featuredTrack.title}</div>
                            <div>by {this.state.data.featuredTrack.owner.username}</div>
                            <Display scene={this.state.data.featuredTrack.scene} />
                        </div>
                        : null
                    }
                </Panel>
                <ScrollDivider link='#editor-panel' />
                <Link to={'editor'}>
                    <Panel id='editor-panel' />
                </Link>
                <ScrollDivider link='#gallery-panel' />
                <PanelPadded isGallery={true} id='gallery-panel'>
                    <Gallery currentUser={this.props.currentUser} isPreview={true} trackNum={2} />
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

module.exports = Index;
