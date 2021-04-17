const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
	local: Number,
	isd: Number,
	std: Number,
	total: Number,
	paymentDate: Date,
	connection: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Connection',
		},
	},
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
});

const Bill = mongoose.model('Bill', BillSchema);

module.exports = Bill;
