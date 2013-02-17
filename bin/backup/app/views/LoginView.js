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