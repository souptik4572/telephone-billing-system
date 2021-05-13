const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Connection = require('../models/connection');
const { isLoggedIn, isAdmin } = require('../middleware');
const {
	getAdminPanel,
	getAllConnectionsOfUser,
	deleteParticularUser,
} = require('../controllers/admin');

// Get admin panel
router.get('/', isLoggedIn, isAdmin, getAdminPanel);

// Get all connections of a particular user
router.get('/:id', isLoggedIn, isAdmin, getAllConnectionsOfUser);

// Delete a particular user
router.delete('/:id', isLoggedIn, isAdmin, deleteParticularUser);

module.exports = router;
