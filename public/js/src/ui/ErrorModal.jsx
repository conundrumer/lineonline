var ErrorActions = require('../actions-error');
var React = require('react');

var ErrorModal = React.createClass({
    onConfirm: function() {
        if (this.props.error.onConfirm) {
            this.props.error.onConfirm();
        }
        ErrorActions.acknowledge();
    },
    onCancel: function() {
        this.props.error.onCancel();
        ErrorActions.acknowledge();
    },
    render: function() {
        return (
            <div>
                { this.props.error.message }
                {
                    this.props.error.onCancel ?
                    <button onClick={this.onCancel}>Cancel</button>
                    : null
                }
                <button onClick={this.onConfirm}>OK</button>
            </div>
        );
    }
});

function exampleConfirm() {
    setTimeout(function() {
        ErrorActions.throwError({
            message: 'you confirmed! this error also has aconfirm callback but no cancel callback',
            onConfirm: alert.bind(null,'okay carry on'),
        });
    }, 100);
}

function exampleCancel() {
    setTimeout(function() {
        ErrorActions.throwError({
            message: 'you canceled! if you clikc cancel you\'ll get and erro with no callbacks',
            onCancel: exampleNone
        });
    }, 100);
}

function exampleNone() {
    setTimeout(function() {
        ErrorActions.throwError({
            message: 'no callbacks for htis'
        });
    }, 100);
}

setTimeout(function() {
    ErrorActions.throwError({
        message: 'example with both callbacsk',
        onConfirm: exampleConfirm,
        onCancel: exampleCancel
    });
}, 100);

module.exports = ErrorModal;
