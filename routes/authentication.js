const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res) => {
	const { username, name, password } = req.body;
	User.register(new User({ username, name }), password, (error, user) => {
		if (error) {
			console.log(error);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/connections');
		});
	});
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/connections',
		failureRedirect: '/auth/login',
	}),
	(req, res) => {}
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
