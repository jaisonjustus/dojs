var AppRouter = Backbone.Router.extend({

	routes : {
		"" : "home"
	},

	home : function()	{
		var homeMainView, registrationView;

		this.userModel = new UserModel();

		homeMainView = new HomeMainView();
		homeMainView.render();

		registrationView = new RegistrationView({ model : this.userModel });
	}

});

var app = new AppRouter();
Backbone.history.start();