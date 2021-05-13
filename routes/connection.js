const express = require('express');
const router = express.Router();
const faker = require('faker');

const User = require('../models/user');
const Connection = require('../models/connection');
const Bill = require('../models/bill');
const { isLoggedIn } = require('../middleware');


// Our helper function to calcuate bill values
const getRandomNumber = (min, max) => {
	return Math.ceil(Math.random() * (max - min) + min);
};

// All of our connection routes

router.get('/:id/paybill', isLoggedIn, (req, res) => {
	const { id } = req.params;
	const billDesc = {};
	(billDesc.local = getRandomNumber(100, 2000)),
		(billDesc.isd = getRandomNumber(1000, 3000)),
		(billDesc.std = getRandomNumber(500, 1000)),
		(billDesc.total = billDesc.isd + billDesc.local + billDesc.std);
	Connection.findById(id, (error, connection) => {
		if (error) {
			console.log('Oops an error occurred while finding connection by id during payment');
			return;
		}
		res.render('paybill', { connection, billDesc });
	});
});

router.post('/:id/paybill', (req, res) => {
	const { id } = req.params;
	const { bill } = req.body;
	const { _id, username } = req.user;
	const owner = {
		id: _id,
		username: username,
	};
	const connection = {
		id: id,
	};
	bill.owner = owner;
	bill.connection = connection;
	bill.paymentDate = new Date();
	Bill.create(bill, (error, bill) => {
		if (error) {
			console.log('Oops an error while creating new bill');
			return;
		}
		const newConnectionData = {
			isPaymentPending: false,
		};
		Connection.findByIdAndUpdate(id, newConnectionData, (error, connection) => {
			if (error) {
				console.log('Oops an error while editing payment boolean of connection');
				return;
			}
			res.redirect('/connections');
		});
	});
});

router.get('/allbills', isLoggedIn, (req, res) => {
	Bill.find({}, (error, bills) => {
		if (error) {
			console.log('Oops an error while fetching all the bills');
			return;
		}
		res.render('allbills', { bills });
	});
});

router.get('/new', isLoggedIn, (req, res) => {
	res.render('new');
});

router.get('/:id/edit', (req, res) => {
	const { id } = req.params;
	Connection.findById(id, (error, connection) => {
		if (error) {
			console.log('Oops an error occurred while finding connection');
		}
		res.render('edit', { connection });
	});
});

router.get('/:id', isLoggedIn, (req, res) => {
	const { id } = req.params;
	Connection.findById(id, (error, connection) => {
		if (error) {
			console.log('Oops an error occurred while finding connection');
		}
		res.render('show', { connection });
	});
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { connection } = req.body;
	Connection.findByIdAndUpdate(id, connection, (error, connection) => {
		if (error) {
			console.log('Oops an error while editing connection');
			return 0;
		}
		res.redirect('/connections');
	});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;
	const { _id, username } = req.user;
	Connection.findByIdAndDelete(id, (error) => {
		if (error) {
			console.log('Oops an error while deleting');
			return 0;
		}
		User.findById(_id, (error, connection) => {
			if (error) {
				console.log('Oops got an error while fetching user data for creating a connection');
				return 0;
			}
			const newUser = {
				numberOfConnections: connection.numberOfConnections - 1,
			};
			User.findByIdAndUpdate(_id, newUser, (error, user) => {
				if (error) {
					console.log(
						'Oops got an error while updating number of connection data of user'
					);
					return 0;
				}
				res.redirect('/connections');
			});
		});
	});
});

router.get('/', isLoggedIn, (req, res) => {
	Connection.find({}, (error, connections) => {
		if (error) {
			console.log('Oops an error while fetching all the connections');
			return;
		}
		res.render('connections', { connections });
	});
});

router.post('/', (req, res) => {
	const { connection } = req.body;
	const { _id, username } = req.user;
	const owner = {
		id: _id,
		username: username,
	};
	connection.connectionName = faker.random.word();
	connection.isPaymentPending = true;
	connection.owner = owner;
	Connection.create(connection, (error, connection) => {
		if (error) {
			console.log('Oops error while creating new connection', error);
			return;
		}
		connection.save((error, connection) => {
			if (error) {
				console.log('Oops error while saving connection');
				return;
			}
			User.findById(_id, (error, connection) => {
				if (error) {
					console.log(
						'Oops got an error while fetching user data for creating a connection'
					);
					return 0;
				}
				const newUser = {
					numberOfConnections: connection.numberOfConnections + 1,
				};
				User.findByIdAndUpdate(_id, newUser, (error, user) => {
					if (error) {
						console.log(
							'Oops got an error while updating number of connection data of user'
						);
						return 0;
					}
					res.redirect('/connections');
				});
			});
		});
	});
});

module.exports = router;
