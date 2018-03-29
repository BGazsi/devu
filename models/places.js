var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://admin:Devu-123@ds155747.mlab.com:55747/heroku_c4g75440");

autoIncrement.initialize(connection);

var placeSchema = new Schema({
	name: String,
	description: String,
	position: {long: Number, lat: Number},
	pictures: [String],
	verified: {
		type: Boolean,
		default: false
	},
	tags: [Number],
	ratings: {
		aggregate: {
			type: Number,
			default: 0
		},
		male: {
			avg: {
				type: Number,
				default: 0
			},
			count: {
				type: Number,
				default: 0
			}
		},
		female: {
			avg: {
				type: Number,
				default: 0
			},
			count: {
				type: Number,
				default: 0
			}
		}
	}
});

placeSchema.plugin(autoIncrement.plugin, 'Places');
var Places = connection.model('Places', placeSchema);

module.exports = Places;