/**
 * Model to manage user details. Also used for user
 * authentication process. this model can be used as user profile.
 * @module UserModel
 */
var UserModel = Backbone.Model.extend({

	urlRoot : 'http://localhost:8080/user',

	/* Url for authenticating user for consuming the api data; */
	authenticationUrl : 'http://localhost:8080/user/login',

	/* Url for denial user from consuming the api data; */
	denialUrl : 'http://localhost:8080/user/logout',

	idAttribute : '_id',

	defaults : {
		name : "contributer name",
		email : "",
		password : "",
	},

	initialize : function()	{
		this.bind("change:token", this.setCookie)
	},

	validate : function(attributes)	{
	
	},

	/**
	 * Method to authentication user and release token to consume
	 * data through the api
	 * @method login
	 * @access public
	 */
	login : function()	{
		var tempUrlRoot;

		/* Backing up the base url; */
		tempUrlRoot = this.urlRoot;

		this.urlRoot = this.authenticationUrl;
		this.save();

		/* Reverting base url; */
		this.urlRoot = tempUrlRoot;
	},

	/**
	 * Method to set the token to cookie.
	 * @method _setCookie
	 * @access private
	 */
	setCookie : function()	{
		document.cookie = "token=" + this.get("token");
	}

})