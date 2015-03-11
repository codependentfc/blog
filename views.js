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
	edit : function(locals) {
				return jade.renderFile(files.edit, locals);
			},
	index : function(locals) {
				return jade.renderFile(files.index, locals);
			}
};

