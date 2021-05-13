const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');

const {
	getBillForConnection,
	payBillForConnection,
	getAllPaidBills,
	getNewConnectionForm,
	getEditConnectionForm,
	getParticularConnection,
	editExistingConnection,
	deleteExistingConnection,
	getAllConnections,
	createNewConnection,
} = require('../controllers/connection');

// All of our connection routes

// Show bill for a particular connection
router.get('/:id/paybill', isLoggedIn, getBillForConnection);

// Submit payment for the bill of a particular connection
router.post('/:id/paybill', payBillForConnection);

// Get list of all paid bills
router.get('/allbills', isLoggedIn, getAllPaidBills);

// Get new connection form
router.get('/new', isLoggedIn, getNewConnectionForm);

// Get form to edit existing connection
router.get('/:id/edit', getEditConnectionForm);

// Get details of a particular connection
router.get('/:id', isLoggedIn, getParticularConnection);

// Edit an existing connection
router.put('/:id', editExistingConnection);

// Delete existing connection
router.delete('/:id', deleteExistingConnection);

// Get all connections
router.get('/', isLoggedIn, getAllConnections);

// Create a new connection
router.post('/', createNewConnection);

module.exports = router;
