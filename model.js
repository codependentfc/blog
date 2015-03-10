var mongoose = require("mongoose");
var http = require("http");
var url = require("url");
var qs = require('querystring');
var creds = require('./creds.json');

mongoose.connect("mongodb://"+creds.dbname+":"+creds.dbpwd+"@ds037611.mongolab.com:37611/facblog");

// Get notification for connection success or failure
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
	console.log("connection made");
});

// Define database schema which determines which properties we want to store 
var blogSchema = mongoose.Schema({
	author : String,
	title  : String,
	text   : String,
	date   : Object
});

// Adding method to the schema. Have to be defined before schema is compiled
//  e.g.
// blogSchema.methods.announce = function() {
// 	var author = this.author ? "Another blog post by " + this.author : "Anonymous blog post";
// 	console.log(author);
// };

// Compile schema into a model, which defines the database collection
// arg1: collection name, arg2: schema name
var blogpost = mongoose.model("blogpost", blogSchema);

// Pass this function the POST request object
exports.newPost = function(POSTbody, callback) {
	// parse request -should return an object with properties matching form field names
	postedData = qs.parse(POSTbody);
	console.log(postedData);
	// construct new post from from data
	var newPost = new blogpost({
		author : postedData.author,
		title  : postedData.title,
		text   : postedData.text,
		date   : Date()
	});

	// use error variable to get error message out of save function scope
	var error;
	newPost.save(function(err){
		if (err) { error = err;}
	});

	if (error) {
		return callback(error, null);
	}
	else {
		return callback(null, 'New post added');
	}

};