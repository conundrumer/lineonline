$ = jQuery = require('jquery');
require('jquery-smooth-scroll');

var LINEONLINE = {
    init: function() {
        this.initVars();
        this.initPlugins();
    },

    initVars: function() {
        this.navbarOffset = -70;
        this.$scrollLink = $('.scroll-link');
    },

    initPlugins: function() {
        this.$scrollLink.smoothScroll({
            offset: this.navbarOffset,
            speed: 600
        });
    }
}

LINEONLINE.init();
