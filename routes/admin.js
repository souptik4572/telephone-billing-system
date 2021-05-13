const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Connection = require('../models/connection');
const { isLoggedIn, isAdmin } = require('../middleware');

router.get('/', isLoggedIn, isAdmin, (req, res) => {
	User.find({}, (error, users) => {
		if (error) {
			console.log('Oops an error while fetching all users');
			return;
		}
		res.render('admin', { users });
	});
});

router.get('/:id', isLoggedIn, isAdmin, (req, res) => {
	const { id } = req.params;
	Connection.find({}, (error, connections) => {
		if (error) {
			console.log('Oops an error occurred while finding connection');
		}
		res.render('showAdmin', { connections: connections, id: id });
	});
});

router.delete('/:id', isLoggedIn, isAdmin, (req, res) => {
	const { id } = req.params;
	User.findByIdAndDelete(id, (error) => {
		if (error) {
			console.log('Oops an error while deleting');
			return 0;
		}
		res.redirect('/admin');
	});
});

module.exports = router;
