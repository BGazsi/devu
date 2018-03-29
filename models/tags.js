var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://admin:Devu-123@ds155747.mlab.com:55747/heroku_c4g75440");

autoIncrement.initialize(connection);

var tagSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	icon:{
		type: String
	}
});

tagSchema.plugin(autoIncrement.plugin, 'Tags');
var Tags = connection.model('Tags', tagSchema);

module.exports = Tags;