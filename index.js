const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const faker = require('faker');
// Our DB models
const User = require('./models/user');
const Connection = require('./models/connection');
const Bill = require('./models/bill');

const connectionRouter = require('./routes/connection');
const adminRouter = require('./routes/admin');

const url = process.env.DATABASEURL || 'mongodb://localhost:27017/user_db';

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const app = express();

app.use(
	expressSession({
		secret: 'telephone-billing-system',
		resave: false,
		saveUninitialized: false,
	})
);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
// Configuring passport in our App

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// Our middleware
// logged in check middleware
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};
// is user admin check middleware
const isAdmin = (req, res, next) => {
	if (req.user.role === 'admin') return next();
	res.redirect('/login');
};

// All our routes

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
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

app.get('/login', (req, res) => {
	res.render('login');
});

app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/connections',
		failureRedirect: '/login',
	}),
	(req, res) => {}
);

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.use('/connections', connectionRouter);
app.use('/admin', adminRouter);

const getRandomNumber = (min, max) => {
	return Math.ceil(Math.random() * (max - min) + min);
};

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.get('*', (req, res) => {
	res.sendFile('./public/error404.html', { root: __dirname });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`App is running at http://localhost:${PORT}. Enjoy`);
});
