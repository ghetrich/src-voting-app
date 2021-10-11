const Router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const initialize = require("../passport-config");

var flash = require("express-flash");

// initialize(
// 	passport,
// 	username => {
// 		return username => User.find(user => user.username === username);
// 	},
// 	id => {
// 		return username => User.find(user => user.id === id);
// 	}
// );

const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy(function (username, password, done) {
		User.findOne({ username: username }, async (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: "Email or password incorrect",
				});
			}

			try {
				if (await bcrypt.compare(password, user.password)) {
					return done(null, user);
				} else {
					return done(null, false, {
						message: "Email or password incorrect",
					});
				}
			} catch (error) {
				return done(error);
			}
		});
	})
);

Router.route("/login").post(
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/",
		failureFlash: true,
	}),
	 (req, res) =>{
		// req.session.isAuth = true;
	 req.flash("info", "Flash Message Added");
	
	}
);

Router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(req.headers.referer);
});

module.exports = Router;
