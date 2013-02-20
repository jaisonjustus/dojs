/**
 * Model to manage user details. Also used for user
 * authentication process. this model can be used as user profile.
 * @module LoginModel
 */
var LoginModel = Backbone.Model.extend({

	loginUrl : '/user/login',

	logoutUrl : '/user/logout',

	urlRoot : '/user',

	idAttribute : '_id',

	defaults : {
		email : 'user@ossc.com',
		name : 'ossc-user',
		password : 'ossc-pass',
		token : 'ossc-token'
	},

	initialize : function()	{
		this.bind("change:token", this.setCookie)
	},

	validate : function(attributes)	{
		if(attributes.password.length <= 0)	{
			return "Password cannot be empty";
		}

		if(attributes.email.length <= 0)	{
			return "email cannot be empty";
		}
	},

	/**
	 * Method to login.
	 * @method login
	 * @access public
	 */
	login : function()	{
		this.urlRoot = "http://localhost:8080" + this.loginUrl;
		this.save();
	},

	/**
	 * Method to set the cookies into the browser.
	 * @method setCookie
	 * @access public
	 */
	setCookie : function()	{
		document.cookie = "token=" + this.get("token");
	}
})