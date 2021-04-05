const express = require('express');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session');
const bodyParser = require('body-parser');

// Our DB models
const User = require('./models/user.js');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// Configuring passport in our App
app.use(passport.initialize());
app.use(passport.session());

app.use(
	expressSession({
		secret: 'Telephone',
		resave: false,
		saveUninitialized: false,
	})
);

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Our middleware
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.render('login');
};

// All our routes

app.get('/home', (req, res) => {
	res.render('home');
});

app.get('/secret', isLoggedIn, (req, res) => {
	res.render('secret');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	const { username, password } = req.body;
	User.register(new User({ username }), password, (error, user) => {
		if (error) {
			console.log(error);
			res.render('register');
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/secret');
		});
	});
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/secret',
		failureRedirect: '/login',
	}),
	(req, res) => {

    }
);

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('home');
});

app.get('/', (req, res) => {
	res.redirect('/home');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App is running at http://localhost:${PORT}. Enjoy`);
});