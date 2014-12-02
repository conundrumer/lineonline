var React = require('react/addons');
var _ = require('underscore');

//UI Components
var Icon = require('./Icon.jsx');

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
    handleInvite: function(e) {
        e.preventDefault();

        var userId = this.refs.inviteeUsername.getDOMNode().value.trim();
        var currInvitees = this.state.track.invitees;

        var user = {
            user_id: userId,
            avatar_url: '../../images/sample_profile.png',
            username: 'balasdfjkl',
        };

        if (userId !== '') { //&& valid

            this.props.onInvite(user);

            // this.setState({
            //     track: _.extend(this.state.track, { invitees: _.union(currInvitees, [user]) })
            // });
            // console.log(this.state.track.invitees);
        }

        this.refs.inviteeUsername.getDOMNode().value = '';



        // var username = this.refs.inviteeUsername.getDOMNode().value.trim();
        // Actions.getUserFromUsername();
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
        console.log('save modal this props invitees: ')
        console.log(this.props.track.invitees);

        console.log('save modal next props invitees: ')
        console.log(nextProps.track.invitees);

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
                        <div className='collab-preview collab-preview-collaborators'>
                            <UserBubble imageSrc='../../images/sample_profile.png' />
                            <UserBubble imageSrc='../../images/sample_profile.png' />
                            <UserBubble imageSrc='../../images/sample_profile.png' />
                        </div>
                    </div>
                    <div className='field'>
                        <label for='invitees'>
                            Invitees:
                        </label>
                        <div className='collab-preview collab-preview-invitees'>
                            {inviteeBubbles}
                        </div>
                        <input ref='inviteeUsername' name='invitees' type='text' />
                        <button className='btn-submit' type='submit' onClick={this.handleInvite}>
                            Invite
                        </button>
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
