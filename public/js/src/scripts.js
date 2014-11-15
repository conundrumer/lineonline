$ = jQuery = require('jquery');
require('jquery-smooth-scroll');
var App = require('./App.jsx');
var React = require('react/addons');

var LINEONLINE = {
    init: function() {
        this.initVars();
        this.initPlugins();
        this.bindEventHandlers();
        console.log('helllooo world');
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
        this.$conversation = $('.side-panel-conversation');
        this.$conversationIcon = $('.conversation-icon');
    },

    initPlugins: function() {
        console.log(this.$scrollLink);
        this.$scrollLink.smoothScroll({
            offset: this.navbarOffset,
            speed: 600
        });
    },

    bindEventHandlers: function() {
        this.$profileNavItem.on('click', this.toggleSettingsDropdown.bind(this));
        this.$signupLoginNavItem.on('click', this.toggleSignupLoginDropdown.bind(this));
        this.$loginLink.on('click', this.toggleSignupLoginForm.bind(this));
        this.$conversationIcon.on('click', this.toggleConversation.bind(this));
    },

    toggleConversation: function(e) {
        this.$conversation.toggleClass('minimized');
        e.preventDefault();
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

React.render(React.createElement(App, null), document.body, LINEONLINE.init.bind(LINEONLINE));
