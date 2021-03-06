const User = require('../models/user');
const Connection = require('../models/connection');

// Get admin panel
const getAdminPanel = (req, res) => {
	User.find({}, (error, users) => {
		if (error) {
			console.log('Oops an error while fetching all users');
			return;
		}
		res.render('admin', { users });
	});
};

// Get all connections of a particular user
const getAllConnectionsOfUser = (req, res) => {
	const { id } = req.params;
	Connection.find({}, (error, connections) => {
		if (error) {
			console.log('Oops an error occurred while finding connection');
		}
		res.render('showAdmin', { connections: connections, id: id });
	});
};

// Delete a particular user
const deleteParticularUser = (req, res) => {
	const { id } = req.params;
	User.findByIdAndDelete(id, (error) => {
		if (error) {
			console.log('Oops an error while deleting');
			return 0;
		}
		res.redirect('/admin');
	});
};

module.exports = {
	getAdminPanel,
	getAllConnectionsOfUser,
	deleteParticularUser,
};
