var url = require('url');
var model = require("./model");
var views = require('./views');
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
		res.writeHead(200, type.html);
		res.end('<h1>blog</h1>');
	}
	else if (url === '/edit' && method === 'GET') {
		res.writeHead(200, type.html);
		res.end(views.edit);
	}
	else if (url === '/edit' && method === 'POST') {
		var body = '';
		req.on('data', function(chunk){
			body += chunk;
		});
		req.on('end', function(){
			console.log(body);
			var response = model.newPost(body, respond);
			res.writeHead(response.code, type.text);
			res.end(response.write);
		});
	}
};

