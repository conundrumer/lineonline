var React = require('react/addons');

//UI Components
var Icon = require('./Icon.jsx');

var Conversation = React.createClass({
    render: function() {
        return (
            <section className='side-panel side-panel-conversation minimized'>
                <Icon class='conversation-icon' icon='chevron-left' />
                <h2>
                    Conversation
                </h2>
                <article className='messages'>
                    <Message messageBody='1 Hello this is the first a simple message.' />
                    <Message messageBody='2 Hello this is another simple message.' />
                    <Message messageBody='3 Hello this is yet anooother simple message.' />
                    <Message messageBody='4 Hello this is yet anooother simple message.' />
                    <Message messageBody='5 Hello this is yet anooother simple message.' />
                    <Message messageBody='6 Hello this is yet anooother simple message.' />
                    <Message messageBody='7 Hello this is yet anooother simple message.' />
                    <Message messageBody='8 Hello this is yet anooother simple message.' />
                    <Message messageBody='9 Hello this is the last yet anooother simple message.' />
                    <Message messageBody='10 Hello this is the last yet anooother simple message.' />
                </article>
                <form className='form-message' method='post' action='/send-message'>
                    <input name='message-text' type='text' placeholder='Type message...' />
                    <button className='btn-submit' type='submit'>
                        Send
                    </button>
                </form>
            </section>
        );
    }
});

var Message = React.createClass({
    render: function() {
        return (
            <div className='message'>
                <div className='message-image' />
                <div className='message-body'>
                    <p>
                        {this.props.messageBody}
                    </p>
                </div>
            </div>
        );
    }
});

module.exports = Conversation;
