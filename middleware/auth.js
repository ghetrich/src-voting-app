module.exports = {
	ensureAuth: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect("/login");
		}
	},

	ensureGuest: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect("/route/dashboard");
		} else {
			return next();
		}
	},

	restricted: roles => (req, res, next) => {
		if (req.isAuthenticated()) {
			res.redirect("/route/dashboard");
		} else {
			return next();
		}
	},
};
