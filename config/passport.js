// const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				callbackURL: "/auth/google/callback",
			},
			async (accessToken, refreshToken, profile, done) => {
				const newUser = {
					googleId: profile.id,
					username: profile.displayName,
					surname: profile.name.familyName,
					othernames: profile.name.givenName,
					password: profile.id,
					image: profile.photos[0].value,
				};

				try {
					let user = await User.findOne({ googleId: profile.id });

					if (user) {
						done(null, user);
					} else {
						user = await User.create(newUser);
						done(null, user);
					}
				} catch (error) {
					console.log(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
