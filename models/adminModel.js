const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = mongoose.Schema({
	
	password: {
		type: String,
		required: [true, 'Please add a password']
	},
	username: {
		type: String,
        unique: true,
		default: ""
	},
	email: {
		type: String,
		default: ""
	},

},
{
	timestamps: true
}

)

module.exports = mongoose.model("Admin", adminSchema)