var mongoose = require("mongoose");
var http = require("http");
var url = require("url");
var qs = require('querystring');
var creds = require('./creds.json');

mongoose.connect("mongodb://"+creds.dbname+":"+creds.dbpwd+creds.dburl);
// mongoose.connect("mongodb://127.0.0.1:27017/newdatabase"); // <-- example local db

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
function newPost(POSTbody, callback) {
	// parse request -should return an object with properties matching form field names
	postedData = qs.parse(POSTbody);
	console.log(postedData);
	// construct new post from from data
	var thisPost = new blogpost({
		author : postedData.author,
		title  : postedData.title,
		text   : postedData.text,
		date   : Date()
	});

	thisPost.save(function(err){
		if (err) {
			return callback(err, null);
		}
		else {
			return callback(null, 'New post added');
		}
	});
}

// fetching all docs is a placeholder behaviour
// TODO refactor to take a second parameter (e.g. 'page') and only bring back 10(?) results at a time
function fetchPosts(callback) {
	blogpost.find({}, function(err, docs){
		console.log("fetchPosts: \n",docs);
		return callback(docs);
	});
}

function delTestPosts() {
	blogpost.remove({title: 'test'}, function(err){
		if (err) {console.error(err);}
		else {console.log('Test posts deleted');}
	});
}

module.exports = {
	newPost : newPost,
	fetchPosts: fetchPosts,
	delTestPosts: delTestPosts
};