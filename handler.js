var url = require('url');

// MIME type table
var type = {
	json : {'Content-Type': 'application/json'},
	js : {'Content-Type': 'application/javascript'},
	css : {'Content-Type': 'text/css'},
	html : {'Content-Type': 'text/html'},
	text : {'Content-Type': 'text/plain'}
};




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
		res.end('<h1>edit</h1><input type=text></input>');
	}
	else if (url === '/edit' && method === 'POST') {
		// blog post addition function here
		if (null) { //ERROR --these responses in post creation funnction
		res.writeHead(500, type.text);
		res.end('Server Error - post not added');
		}
		else { //
		res.writeHead(200, type.text);
		res.end('Blog post added');
		}
	}

    

};
