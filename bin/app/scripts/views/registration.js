var RegistrationView = Backbone.View.extend({

	el : '#registration-form',

	events : {
		"submit" : "registerUser",
	},

	registerUser : function(event)	{

		event.preventDefault();
		
		this.model.set("name",$(event.currentTarget).find("#name").val());
		this.model.set("email", $(event.currentTarget).find("#email").val());
		this.model.set("password", $(event.currentTarget).find("#password").val());
		
		this.model.save();
	}

});