var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');

//Actions
var Actions = require('../actions');

//Data Stores
// var SettingsStore = require('../stores/settings');

//UI Components
var Footer = require('./Footer.jsx');

var Settings = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <Footer />
            </div>
        );
    }
});

module.exports = Settings;
