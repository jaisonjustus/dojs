define(['jquery', 'underscore', 'backbone', 
	'tpl!../scripts/templates/home.html'], function($, _, Backbone, homeTpl)	{

		return Backbone.View.extend({

			el : '#app-wrapper',

			template : homeTpl,

			render : function()	{
				this.$el.html(this.template());
				return this;
			}

		});

})