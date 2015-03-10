var jade = require('jade');
var path = require('path');

var files = {
	edit : path.join(__dirname,'/templates/edit.jade')
};

module.exports = {
	edit : jade.renderFile(files.edit, {test: 'OH HAI THERE'})
};




// exports.edit = 
// '<h1>Create new post</h1>'+
// '<form action="edit" method="POST">'+
// 	'Name:'+
// 	'<input type="text" name="author"></input>'+
// 	'Post Title:'+
// 	'<input type="text" name="title"></input>'+
// 	'Text:'+
// 	'<input type="text" name="text"></input>'+
// 	'<input type="submit" name="Submit"></input>'+
// '</form>';


