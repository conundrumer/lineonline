$ = jQuery = require('jquery');
require('jquery-smooth-scroll');

var LINEONLINE = {
    init: function() {
        this.initVars();
        this.initPlugins();
        this.bindEventHandlers();
    },

    initVars: function() {
        this.navbarOffset = -70;
        this.$scrollLink = $('.scroll-link');
        this.$profileNavlink = $('.nav-item-profile').find('.navlink');
        this.$settingsDropdown = $('.dropdown-settings');
    },

    initPlugins: function() {
        this.$scrollLink.smoothScroll({
            offset: this.navbarOffset,
            speed: 600
        });
    },

    bindEventHandlers: function() {
        this.$profileNavlink.on('click', this.toggleSettingsDropdown.bind(this));
    },

    toggleSettingsDropdown: function(e) {
        // var $el = $(e.currentTarget).parent();
        // var $dropdown = $el.find('.dropdown');
        this.$settingsDropdown.stop(true, false).fadeToggle();
        e.preventDefault();
    }
}

LINEONLINE.init();
