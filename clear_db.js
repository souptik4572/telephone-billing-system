const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/user_db', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const User = require('./models/user');
const Connection = require('./models/connection');
const Bill = require('./models/bill');

User.deleteMany({}, (error) => {
	if (error) {
		console.log('Oops error while deleting all users');
		return 0;
	}
	console.log('All users has been deleted');
});

Connection.deleteMany({}, (error) => {
	if (error) {
		console.log('Oops error while deleting all connections');
		return 0;
	}
	console.log('All connections has been deleted');
});

Bill.deleteMany({}, (error) => {
	if (error) {
		console.log('Oops error while deleting all bills');
		return 0;
	}
	console.log('All bills has been deleted');
});
