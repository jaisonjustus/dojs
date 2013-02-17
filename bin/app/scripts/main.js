/**
 * Configuring require js.
 */
require.config({

	paths : {
		/** Vendor libraries. **/
		'jquery' : '../components/jquery/jquery',
		'underscore' : '../components/lodash/lodash',
		'backbone' : '../components/backbone-amd-lodash/backbone',
		'tpl' : '../components/requirejs-tpl/tpl',
		
		/** Backbone Views. **/
		'homeview' : 'views/home'
		/** Backbone Collection. **/

		/** Backbone Model **/

	}

});

define(['underscore', 'backbone', 'app'], function(_, Backbone, App)	{
	new App();
	Backbone.history.start({ root : '/'});
});