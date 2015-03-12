
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
	
	console.log('Request Received\n', 'url: '+url+'\n', 'method:'+method+'\n');
	// index page
	if (url === '/' && method === 'GET' ) {
		model.fetchPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.index( {posts: docs} ));
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
			res.end(views.edit( {posts: docs} ));
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
				model.fetchPosts(function(docs) {
					res.writeHead( response.code, type.html);
					res.end(views.edit( {posts: docs, alert: response.write, statusCode: response.code} ));
				});
			});
		});
	}

	else if (/\/[0-9a-fA-F]{24}/.test(url) && method === 'PUT') {

	}

	else if (/\/[0-9a-fA-F]{24}/.test(url) && method === 'DELETE') {
		
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