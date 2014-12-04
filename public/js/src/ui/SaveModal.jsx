var React = require('react/addons');
var _ = require('underscore');
var ReactBacon = require('react-bacon');
var request = require('superagent');

//UI Components
var Icon = require('./Icon.jsx');

var DEBOUNCE_DELAY = 350; // in ms, amount to delay before continuing
var InviteSearch = React.createClass({
    mixins: [ReactBacon.BaconMixin],
    getInitialState: function() {
        return {
            query: '',
            selectedUser: null,
            searchResults: []
        };
    },
    componentWillMount: function() {
        this.eventStream('inputChanged')
            .map('.target.value')
            .onValue(function(username) {
                this.setState({
                    query: username
                });
            }.bind(this));

        this.eventStream('inputChanged')
            .map('.target.value')
            .debounce(DEBOUNCE_DELAY)
            .onValue(function(username) {
                request.get('/api/users?q=' + username)
                    .end(function (err, res) {
                        if (res.status === 200) {
                            this.gotUsers(res.body);
                            return;
                        }
                    console.log('could not query for user');
                }.bind(this));
            }.bind(this));
    },
    gotUsers: function(results) {
        console.log('got users:', results.map(function(user) {
            return user.username;
        }));
        this.setState({
            searchResults: results
        });
        if (results[0] && results[0].username === this.state.query) {
            this.setState({
                selectedUser: results[0]
            });
        }
    },
    onInvite: function(e) {
        e.preventDefault();
        console.log("inviting: ", this.state.selectedUser);
        if (this.state.selectedUser) {
            this.props.onInvite(this.state.selectedUser);
            this.refs.inviteeUsername.getDOMNode().value = '';
        }
    },
    render: function() {
        return (
            <div>
                <input ref='inviteeUsername' autoComplete='off' type='text' name='username' value={this.state.query} onChange={this.inputChanged} />
                <button className='btn-submit' type='submit' onClick={this.onInvite}>
                    Invite
                </button>
            </div>
        );
    }
});

var SaveModal = React.createClass({
    getInitialState: function() {
        return {
            track: this.props.track
        };
    },
    onInputChange: function(inputName) {
        return function(event) {
            var newTrackData = {};
            newTrackData[inputName] = event.target.value;
            this.setState({
                track: _.extend(this.state.track, newTrackData)
            });
        }.bind(this);
    },
    onTagsChange: function(event) {
        this.setState({
            track: _.extend(this.state.track, { tags: event.target.value.split(',') })
        });
    },
    processTags: function(value) {
        var inputValueArr = value.split(',');
        inputValueArr.forEach(function(el, idx, arr) {
            arr[idx] = el.trim();
        });
        inputValueArr = inputValueArr.filter(function(el) {
            return el !== '';
        });
        return inputValueArr;
    },
    handleFormSubmit: function(e) {
        e.preventDefault();

        var titleValue = this.refs.trackTitle.getDOMNode().value.trim()
        titleValue = (titleValue === '') ? 'Untitled' : titleValue;
        // console.log(this.state.track.invitees);

        var trackMetaData = {
            title: titleValue,
            description: this.refs.trackDescription.getDOMNode().value.trim(),
            tags: this.processTags(this.refs.trackTags.getDOMNode().value.trim())
        };

        this.props.onSave(trackMetaData);
    },
    handleInvite: function(user) {
        var currInvitees = this.state.track.invitees;
        this.props.onInvite(user);
    },
    handleDeleteCollaborator: function(e) {

    },
    handleDeleteInvitee: function(e) {

    },
    componentWillMount: function() {
        this.setState({
            track: this.props.track
        });
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.track !== nextProps.track) {
            this.setState({
                track: nextProps.track
            });
        }
    },
    render: function() {
        var inviteeBubbles = this.state.track.invitees.map(function(invitee) {
            return (
                <UserBubble imageSrc={invitee.avatar_url} />
            );
        });

        var collaboratorBubbles = this.state.track.collaborators.map(function(collaborator) {
            return (
                <UserBubble imageSrc={collaborator.avatar_url} />
            );
        });

        return (
            <div className={'save-modal' + (this.props.isModalHidden ? ' hide' : '')}>
                <div onClick={this.props.onCloseModal}>
                    <Icon class='x-icon x-icon-dark' icon='circle-x' />
                </div>
                <form ref='trackForm' className='form-editor form-editor-track'>
                    <div className='field'>
                        <label for='title'>
                            Title:
                        </label>
                        <input
                            ref='trackTitle'
                            name='title'
                            type='text'
                            placeholder='Untitled'
                            value={this.state.track ? this.state.track.title : ''}
                            onChange={this.onInputChange('title')}
                        />
                    </div>
                    <div className='field'>
                        <label for='description'>
                            Description:
                        </label>
                        <textarea
                            ref='trackDescription'
                            name='description'
                            value={this.state.track ? this.state.track.description : ''}
                            onChange={this.onInputChange('description')}
                        />
                    </div>
                    <div className='field'>
                        <label for='tags'>
                            Tags: <span className='note'>(separated by a comma)</span>
                        </label>
                        <input
                            ref='trackTags'
                            name='tags'
                            type='text'
                            value={this.state.track ? (this.state.track.tags) : ''}
                            onChange={this.onTagsChange}
                        />
                    </div>
                </form>
                <form ref='collabForm' className='form-editor form-editor-collab'>
                    <div className='field'>
                        <h3>
                            Collaborators:
                        </h3>
                        {collaboratorBubbles.length > 0 ?
                            <div className='collab-preview collab-preview-collaborators'>
                                {collaboratorBubbles}
                            </div>
                            :
                            <div className='collab-preview collab-preview-collaborators'>
                                <p className='message-panel message-panel-center message-panel-bubbles'>
                                    No collaborators to show.
                                </p>
                            </div>

                        }
                    </div>
                    <div className='field'>
                        <label for='invitees'>
                            Invitees:
                        </label>
                        {inviteeBubbles.length > 0 ?
                            <div className='collab-preview collab-preview-invitees'>
                                {inviteeBubbles}
                            </div>
                            :
                            <div className='collab-preview collab-preview-invitees'>
                                <p className='message-panel message-panel-center message-panel-bubbles'>
                                    No invitees to show.
                                </p>
                            </div>

                        }
                        <InviteSearch onInvite={this.handleInvite} />
                    </div>
                </form>
                <button className='btn-submit btn-save-modal' type='submit' onClick={this.handleFormSubmit}>
                    Save
                </button>
            </div>
        );
    }
});

var UserBubble = React.createClass({
    render: function() {
        return (
            <div className='user-img'>
                <img src={this.props.imageSrc} />
            </div>
        );
    }
});

module.exports = SaveModal;
