define(['underscore', 'backbone', 'homeview'], function(_, Backbone, HomeView)	{

	return Backbone.Router.extend({
		
		routes : {
			'/' : 'login'
		},

		initialize : function()	{
			this.homeView = new HomeView();
			this.homeView.render();
		},

		login : function()	{
			
		}

	});

});