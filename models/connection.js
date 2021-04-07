const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	mobileNumber: String,
	address: String,
	connectionType: String,
	connectionName: String,
	imageUrl: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
});

const Connection = mongoose.model('Connection', ConnectionSchema);

module.exports = Connection;
