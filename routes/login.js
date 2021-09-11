const Router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const login = async (credentials, role, res) => {
	let { username, password } = credentials;

	if (!username || !password) {
		return res.status(400).send({
			success: false,
			msg: "Please enter all fields",
		});
	}

	User.findOne({ username }).then(user => {
		if (!user) {
			return res
				.status(400)
				.send({ success: false, msg: "User does not exist" });
		}

		if (!role.some(r => user.role.includes(r))) {
			return res.status(400).send({
				success: false,
				msg: "Please make sure you are signing in from the right portal ",
			});
		}

		bcrypt.compare(password, user.password).then(isMatch => {
			if (!isMatch) {
				return res
					.status(400)
					.send({ success: false, msg: "Invalid credentials" });
			} else {
				jwt.sign(
					user.toJSON(),
					process.env.ACCESS_TOKEN_SECRET,
					// { expiresIn: 3600 },
					(err, token) => {
						if (err) throw err;

						return res.send({
							token,
							user,
						});
					}
				);
			}
		});
	});
};

Router.post("/", (req, res) => {
	login(req.body, ["admin"], res);
});

module.exports = Router;
