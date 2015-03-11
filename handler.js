var url = require('url');
var model = require("./model");
var views = require('./views');
var fs = require('fs');
var path = require('path');

// MIME type table
var type = {
	json : {'Content-Type': 'application/json'},
	js : {'Content-Type': 'application/javascript'},
	css : {'Content-Type': 'text/css'},
	html : {'Content-Type': 'text/html'},
	text : {'Content-Type': 'text/plain'}
};

function respond(err, done) {
	if (err) {
		return {code: 404, write: err};
	}
	else {
		return {code: 200, write: done};
	}
}

module.exports = function handler(req, res) {

	url =  req.url;
	method = req.method;
	
	console.log('Request Received\n', 'url: '+url+'\n', 'method:'+method+'\n');
	// index page
	if (url === '/' && method === 'GET' ) {
		model.fetchPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.index( {posts:docs} ));
		});
	}
	// individual post
	else if (/\/[0-9a-fA-F]{24}/.test(url) && method === 'GET' ) {
		
		var requestedPost = url.replace(/\//, '');
		console.log('Post Requested. Id: \n', requestedPost);
		model.fetchPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.post( {posts: docs, postId: requestedPost } ));
		});
	}
	// edit page
	else if (url === '/edit' && method === 'GET') {
		model.fetchPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.edit( {posts:docs} ));
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
			var response = model.newPost(body, respond);
			res.writeHead(response.code, type.html);
			res.end( views.edit( { alert: response.write } ) );
		});
	}

	///////////////////
	// STATIC ROUTES //
	///////////////////
	// TODO - refactor static routes into a function. regex for file ext, then regex to lookup on an object of file paths?
	else if (url === '/style.css' && method === 'GET') {
		fs.readFile(path.join(__dirname, '/public/css/style.css'), function(err, data){
			if (err) {
				res.writeHead(404, type.text);
				res.end(err);
			}
			else {
				res.writeHead(200, type.css);
				res.end(data);
			}
		});
	}

	else if ( url === '/bootstrap.min.css' && method === 'GET') {
		fs.readFile(path.join(__dirname, '/public/css/bootstrap.min.css'), function(err, data){
			if (err) {
				res.writeHead(404, type.text);
				res.end(err);
			}
			else {
				res.writeHead(200, type.css);
				res.end(data);
			}
		});
	}

	else if (url === '/bootstrap.min.js' && method === 'GET') {
		fs.readFile(path.join(__dirname, '/public/lib/bootstrap.min.js'), function(err, data){
			if (err) {
				res.writeHead(404, type.text);
				res.end(err);
			}
			else {
				res.writeHead(200, type.js);
				res.end(data);
			}
		});
	}

	else if (url === '/jquery-2.1.3.min.js' && method === 'GET') {
		fs.readFile(path.join(__dirname, '/public/lib/jquery-2.1.3.min.js'), function(err, data){
			if (err) {
				res.writeHead(404, type.text);
				res.end(err);
			}
			else {
				res.writeHead(200, type.js);
				res.end(data);
			}
		});
	}
};