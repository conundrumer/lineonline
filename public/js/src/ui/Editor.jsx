var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
// var HomeStore = require('../stores/home');

//UI Components
var Conversation = require('./Conversation.jsx');
var Panel = require('./Panel.jsx');
var Footer = require('./Footer.jsx');

//Linerider
var LineriderEditor = require('../linerider/Editor.jsx');

var Editor = React.createClass({
    render: function() {
        var EMPTY_SCENE = {
            next_point_id: 0,
            next_line_id: 0,
            points:{},
            lines:{}
        };
        var DEFAULT_HANDLER = function(e){console.log(e)};
        return (
            <div className='main-content'>
                <Panel>
                    <LineriderEditor
                        initScene={EMPTY_SCENE}
                        onSave={DEFAULT_HANDLER}
                    />
                    <Conversation />
                </Panel>
            </div>
        );
    }
});

module.exports = Editor;
