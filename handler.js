
// TODO stop fetching whoole db for each view. Limit req size, and cache!

var model = require("./model");
var views = require('./views');
var fs = require('fs');
var path = require('path');
var urlNODE = require('url');

// MIME type table
var type = {
	json : {'Content-Type': 'application/json'},
	js : {'Content-Type': 'application/javascript'},
	css : {'Content-Type': 'text/css'},
	html : {'Content-Type': 'text/html'},
	text : {'Content-Type': 'text/plain'}
};

//  resource paths
var files = {
	'/style.css': path.join(__dirname, '/public/css/style.css'),
	'/bootstrap.min.css': path.join(__dirname, '/public/css/bootstrap.min.css'),
	'/bootstrap.min.js': path.join(__dirname, '/public/lib/bootstrap.min.js'),
	'/jquery-2.1.3.min.js' : path.join(__dirname, '/public/lib/jquery-2.1.3.min.js'),
};

function respond(err, data) {
	if (err) {
		return {code: 404, write: err};
	}
	else {
		return {code: 200, write: data};
	}
}

module.exports = function handler(req, res) {

	url =  req.url;
	method = req.method;
	var queries = urlNODE.parse(req.url, true).query;

	console.log('Request Received\n', 'url: '+url+'\n', 'method:'+method+'\n');
	// index page
	if (url === '/' && method === 'GET' ) {
		model.fetchAllPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.index( {posts: docs} ));
		});
	}
	// individual post
	else if (/^\/[0-9a-fA-F]{24}/.test(url) && queries.method === 'GET' ) {
		
		var requestedPost = url.replace(/\//, '').replace(/\?.+/,'');
		console.log('Post Requested. Id: \n', requestedPost);
		model.fetchAllPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.post( {posts: docs, postId: requestedPost } ));
		});
	}
	// edit page
	else if (url === '/edit' && method === 'GET') {
		model.fetchAllPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.edit( {view: 'edit', posts: docs} ));
		});
	}
	// submit new post
	else if (url === '/edit' && method === 'POST') {
		var body = '';
		req.on('data', function(chunk){
			body += chunk;
		});
		req.on('end', function(){
			console.log('POST body:\n',body);
			model.newPost(body, function(err, data){
				var response = respond(err, data);
				model.fetchAllPosts(function(docs) {
					res.writeHead( response.code, type.html);
					res.end(views.edit( {view: 'edit', posts: docs, alert: response.write, statusCode: response.code} ));
				});
			});
		});
	}
	// load post in edit form 
	else if (/\/edit\/[0-9a-fA-F]{24}/.test(url) && queries.method === 'GET') {
		console.log('Edit Post');
		var updatePostId = url.replace(/\/edit\//, '').replace(/\?.+/,'');
		console.log('Fetching ',updatePostId);
		model.fetchPost(updatePostId, function (err, post) {
			model.fetchAllPosts(function(docs){
				if (err) {
					res.writeHead(404, type.html);
					res.end(views.edit( {view: 'edit', posts: docs, alert: err, statusCode: 404} ));
				}
				else {
					res.writeHead(200, type.html);
					res.end(views.edit( {view: 'edit', posts: docs, alert: 'Make changes and remember to click the \'Edit Post\' button to submit!', 
										statusCode: 304, postId: post._id, postAuthor: post.author, postTitle: post.title, postText: post.text} ));
				}
			});
		});
	}
	// submit edited post
	// !!!! Weird thing here, url is being received as 'edit/edit/{post id}'. form action is just one 'edit'! :S
	else if (/\/edit\/[0-9a-fA-F]{24}/.test(url) && queries.method === 'PUT') {
		console.log('Submiting Edited Post');
		console.log(url);
		var editPostId = url.replace(/\/edit\//, '').replace(/\?.+/,'').replace(/edit\//,''); // last regex a kludge for extra 'edit'!
		var updateBody = '';
		req.on('data', function(chunk){
			updateBody += chunk;
		});
		req.on('end', function(){
			console.log('POST body:\n', updateBody);
			model.updatePost(editPostId, updateBody, function(err, data){
				model.fetchAllPosts(function(docs){
					if (err) {
						res.writeHead(404, type.html);
						res.end(views.edit( {view: 'edit', posts: docs, alert: err, statusCode: 404} ));
					}
					else {
						res.writeHead(200, type.html);
						res.end(views.edit( {view: 'edit', posts: docs, alert: 'Post succesfully updated!  '+data, statusCode: 200} ));
					}
				});
			});
		});
	}


	else if (/\/[0-9a-fA-F]{24}/.test(url) && queries.method === 'DELETE') {
		var deletePostId = url.replace(/\//, '').replace(/\?.+/,'');
		model.deletePost( deletePostId, function(err, data){
			model.fetchAllPosts(function(docs){
				if (err) {
					res.writeHead(404, type.html);
					res.end(views.edit( {view: 'edit', posts: docs, alert: err, statusCode: 404} ));
				}
				else {
					res.writeHead(200, type.html);
					res.end(views.edit( {view: 'edit', posts: docs, alert: data, statusCode: 200} ));
				}
			});
		});
	}

	else if ( /.css|.js/.test(url) ){
		var ext = /(css|js)\b/.exec(url)[0];
		fs.readFile(files[url], function(err, data){
			if (err) {
				res.writeHead(404, type.text);
				res.end(err);
			}
			else {
				res.writeHead(200, type[ext]);
				res.end(data);
			}
		});
	}
};