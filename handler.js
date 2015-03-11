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

	if (url === '/' && method === 'GET' ) {
		model.fetchPosts(function(docs) {
			res.writeHead(200, type.html);
			res.end(views.index( {posts:docs} ));
		});
	}
	else if (url === '/edit' && method === 'GET') {
		res.writeHead(200, type.html);
		res.end(views.edit());
	}
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
	else if ((url.search(/.css/ !== -1) && method === 'GET')) {
		fs.readFile(path.join(__dirname, '/style.css'), function(err, data){
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
};


	

