const express = require('express');
const router = express.Router();

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
		failureRedirect: '/login',
	}),
	(req, res) => {}
);

router.post('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router
