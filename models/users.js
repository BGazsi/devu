var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://admin:Devu-123@ds155747.mlab.com:55747/heroku_c4g75440");

autoIncrement.initialize(connection);
 
var userSchema = new Schema({
	role: {
		type: Number,
		required: true
	},  
	email: {
		type: String,
		required: true
	},  
	sex: {
		type: String,
		enum: ['male', 'female'],
		required: true
	},  
	name: String,  
	password: String,  
	favorites: [Number],  
	ratedPlaces: [
		{
			placeID: Number,
			value: Number
		}
	],
	verified: {
		type: Boolean,
		default: true
	},  
	disabled: {
		type: Boolean,
		default: false
	}  
});

userSchema.plugin(autoIncrement.plugin, 'Users');
var Users = connection.model('Users', userSchema);
 
module.exports = Users;