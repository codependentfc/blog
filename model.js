var mongoose = require("mongoose");
var http = require("http");
var url = require("url");
var qs = require('querystring');
var creds = require('./creds.json');

mongoose.connect("mongodb://"+creds.dbname+":"+creds.dbpwd+"@ds037611.mongolab.com:37611/facblog");
// mongoose.connect("mongodb://127.0.0.1:27017/newdatabase");

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

	// HOW CAN I SUCCESSFULLY RETURN THE RESULT OF THE SAVE ASYNC METHOD TO THE CALLBACK??
	// I think currently the if statement will be executed without waiting for the save method affect the error var
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

// fetching all docs is a placeholder behaviour
// TODO refactor to take a second parameter (e.g. 'page') and only bring back 10(?) results at a time
exports.fetchPosts = function(callback) {
	blogpost.find({}, function(err, docs){
		console.log("fetchPosts: \n",docs);
		return callback(docs);
	});
};