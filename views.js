var jade = require('jade');
var path = require('path');
var model = require('./model');

var files = {
	edit : path.join(__dirname,'/templates/edit.jade'),
	index: path.join(__dirname,'/templates/index.jade')
};

var indexPosts;
function assign(input, variable) {
 variable = input;
}

module.exports = {
	edit : jade.renderFile(files.edit, {test: 'OH HAI THERE'}),
	index : jade.renderFile(files.index, {posts: model.fetchPosts(function(docs) {console.log('template fetch:\n',docs); return docs;}),
											testArray: ['one', 'two', 'three'],	
											testString: 'HARRO!'})
};

