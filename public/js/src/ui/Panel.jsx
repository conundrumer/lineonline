var React = require('react/addons');

var Panel = React.createClass({
    render: function() {
        var cx = React.addons.classSet;
        var classes = cx({
            'panel': true,
            'masthead': this.props.isMasthead,
            'editor': this.props.isEditor,
            'playback': this.props.isPlayback,
            'gallery': this.props.isGallery,
            'favorites': this.props.isFavorites,
            'settings': this.props.isSettings,
            'home': this.props.isHome,
            'profile': this.props.isProfile,
            'subscriptions': this.props.isSubscriptions,
            'not-found': this.props.isNotFound
        });
        return (
            <section className={classes} id={this.props.id}>
                {this.props.children}
            </section>
        );
    }
});

module.exports = Panel;


