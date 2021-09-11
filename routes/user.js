const Router = require("express").Router();
const User = require("../models/user");
const restrictedTo = require("../middleware/restricted");
const bcrypt = require("bcryptjs");

Router.post("/new", restrictedTo(["admin"]), (req, res) => {
	const { surname, othernames, role, username, password } = req.body;
	const image = "http://localhost:3030/uploads/images/1.jpg";
	if (!surname || !othernames || !role || !username || !password) {
		return res.status(400).send({
			error: "Please enter all fields",
		});
	}

	User.find({ username })
		.then(userExist => {
			if (userExist.length > 0) {
				return res.status(402).send({ error: "User already exists" });
			}

			const user = new User({
				surname,
				othernames,
				role,
				username,
				password,
				image,
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(user.password, salt, (err, hash) => {
					user.password = hash;
					user
						.save()
						.then(user => {
							return res.status(200).send(user);
						})
						.catch(err => {
							return res
								.status(500)
								.send({ error: "user could not be saved" });
						});
				});
			});
		})
		.catch(err => {
			return res.status(500).send({ error: err });
		});
});

Router.get("/", restrictedTo(["admin"]), (req, res) => {
	User.find({})
		.select("-password")
		.then(user => {
			return res.status(200).send(user);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

module.exports = Router;
