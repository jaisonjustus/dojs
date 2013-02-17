var LoginView = Backbone.View.extend({

	el : '#loginForm',

	events : {
		"submit" : "authenticate"
	},

	authenticate : function(event)	{
		event.preventDefault();
		var target, username, password;

		username = $(event.currentTarget).find('#username').val();
		password = $(event.currentTarget).find('#password').val();

		this.model = new LoginModel();
		this.model.set("email", username);
		this.model.set("password", password);
		this.model.login();
	}

});

/**
 * Module to handle login and registration for the application
 * @module LoginView
 */
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone, loginFormTpl)	{

	return Backbone.View.extend({

		tag : 'div',

    template : loginFormTpl,

    events : {
      'click #login' : '_onLogin'
    },

    /* Object to handle dom elements inside the login form. */
    _selectors : {},

    render : function() {
      this.$el.html(this.template());
      return this;
    },

    /**
     * Method to initialize the dom elements in the login control.
     * @method _initSelector
     * @access private
     */
    _initSelectors : function() {
      this._selectors.username = this.$('#username');
      this._selectors.password = this.$('#password');
    },

    /**
     * Method to populate the model with the user input.
     * @method _populateModel
     * @access private
     */
    _populateModel : function()  {

    },

    /**
     * Method to handle the login button click event.
     * @method _onLogin
     * @access private
     */
    _onLogin : function() {

    }

	});

});