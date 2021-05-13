const middlewareObject = {};

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

middlewareObject.isLoggedIn = isLoggedIn;
middlewareObject.isAdmin = isAdmin;

module.exports = middlewareObject;