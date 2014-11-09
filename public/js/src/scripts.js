$ = jQuery = require('jquery');
require('jquery-smooth-scroll');

var LINEONLINE = {
    init: function() {
        this.initVars();
        this.setVisibility();
        this.initPlugins();
        this.bindEventHandlers();
    },

    initVars: function() {
        this.navbarOffset = -70;
        this.$scrollLink = $('.scroll-link');
        this.$profileNavItem = $('.nav-item-profile').find('.navlink');
        this.$signupLoginNavItem = $('.nav-item-signup-login').find('.navlink');
        this.$settingsDropdown = $('.dropdown-settings');
        this.$signupLoginDropdown = $('.dropdown-signup-login');
        this.$loginLink = $('.login-link');
        this.$signupForm = $('#form-signup');
        this.$loginForm = $('#form-login');
    },

    setVisibility: function() {
        this.$signupLoginDropdown.hide();
    },

    initPlugins: function() {
        this.$scrollLink.smoothScroll({
            offset: this.navbarOffset,
            speed: 600
        });
    },

    bindEventHandlers: function() {
        this.$profileNavItem.on('click', this.toggleSettingsDropdown.bind(this));
        this.$signupLoginNavItem.on('click', this.toggleSignupLoginDropdown.bind(this));
        this.$loginLink.on('click', this.toggleSignupLoginForm.bind(this));
    },

    toggleSettingsDropdown: function(e) {
        // var $el = $(e.currentTarget).parent();
        // var $dropdown = $el.find('.dropdown');
        this.$settingsDropdown.stop(true, false).fadeToggle();
        e.preventDefault();
    },

    toggleSignupLoginDropdown: function(e) {
        // var $el = $(e.currentTarget).parent();
        // var $dropdown = $el.find('.dropdown');



        if (!this.$signupLoginDropdown.is(':visible')) {
            console.log('hiding login, revealing signup');
            this.$signupForm.removeClass('hidden');
            this.$loginForm.addClass('hidden');
        }

        this.$signupLoginDropdown.stop(true, false).fadeToggle();
        // setTimeout(function() {
        //     context.$signupForm.removeClass('hidden');
        //     context.$loginForm.addClass('hidden');
        // });
        e.preventDefault();
    },

    toggleSignupLoginForm: function(e) {
        this.$signupForm.addClass('hidden');
        this.$loginForm.removeClass('hidden');
        e.preventDefault();
    }
}

LINEONLINE.init();
