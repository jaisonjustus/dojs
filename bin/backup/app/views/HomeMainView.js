var HomeMainView = Backbone.View.extend({

	el : '#app-wrapper',

	template : _.template($('#home-template').html()),

	render : function()	{
		this.$el.html(this.template);
		return this;
	}

});