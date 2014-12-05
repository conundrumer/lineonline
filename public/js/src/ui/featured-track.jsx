var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Reflux = require('reflux');
var _ = require('underscore');

//Actions
var Actions = require('../actions');

//Data Stores
var ProfileStore = require('../stores/profile');

//UI Components
var Icon = require('./Icon.jsx');
var MediaIcons = require('./MediaIcons.jsx');
var TracksPreview = require('./TracksPreview.jsx');
var PanelPadded = require('./PanelPadded.jsx');
var Footer = require('./Footer.jsx');
var ProfileFeaturedTrack = require('./featured-track.jsx');

//Linerider
var Display = require('../linerider/Display.jsx');

var ProfileFeaturedTrack = React.createClass({
    render: function() {
        var collaboratorListItems = this.props.featuredTrack.collaborators.map(function(collaborator) {
            return (
                <li>
                    <Link to={'/profile/' + collaborator.user_id}>
                        {collaborator.username}
                    </Link>
                </li>
            );
        });
        return (
            <article className='profile-featured-track'>
                <Link to={'/track/' + this.props.featuredTrack.track_id}>
                    <div>
                        <Icon class='preview-icon' icon='fullscreen-enter' />
                    </div>
                </Link>
                <MediaIcons />
                <Display scene={this.props.featuredTrack.scene} preview={true} />
                <aside className='info'>
                    <div>
                        <h3>{this.props.featuredTrack.title}</h3>
                        {this.props.featuredTrack.description ?
                            <p>
                                {this.props.featuredTrack.description}
                            </p>
                            :
                            <p>
                            </p>
                        }
                        <h3>Owner</h3>
                        <p>
                            <Link to={'/profile/' + this.props.featuredTrack.owner.user_id}>
                                {this.props.featuredTrack.owner.username}
                            </Link>

                        </p>
                        {
                            collaboratorListItems.length > 0 ?
                            <div>
                                <h3>Collaborators</h3>
                                <ul>
                                    {collaboratorListItems}
                                </ul>
                            </div>
                            : null
                        }
                    </div>
                </aside>
            </article>
        );
    }
});

module.exports = ProfileFeaturedTrack;
