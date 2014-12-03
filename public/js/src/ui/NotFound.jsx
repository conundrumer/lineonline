var React = require('react/addons');

//Actions
var Actions = require('../actions');

//UI Components
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');

var NotFound = React.createClass({
    render: function() {
        return (
            <div className='main-content'>
                <PanelPadded isNotFound={true}>
                    <p>404 Not Found </p>
                </PanelPadded>
                <Footer />
            </div>
        );
    }
});

module.exports = NotFound;
