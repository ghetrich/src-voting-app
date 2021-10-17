const Router = require("express").Router();
const User = require("../models/user");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const sendMail = require("../mailService");
const { uploadProfile } = require("../middleware/upload");
const restrictedTo = require("../middleware/restricted");
const bcrypt = require("bcryptjs");

Router.post("/new", uploadProfile.single("image"), (req, res) => {
	const { surname, othernames, role, username, phone } = req.body;
	console.log(req.body);
	let image = "uploads/images/1.jpg";
	if (!surname || !othernames || !role || !username || !phone) {
		return res.status(400).send({
			error: "Please enter all fields",
		});
	}

	if (req.file) {
		image = req.file.path;
		console.log(req.file);
	}

	User.find({ username })
		.then(userExist => {
			if (userExist.length > 0) {
				return res.status(402).send({ error: "User already exists" });
			}

			let password = nanoid(8).toUpperCase();

			const user = new User({
				surname,
				othernames,
				role,
				username,
				password,
				phone,
				image,
			});

			bcrypt.genSalt(10, (err, salt) => {
				console.log(password);
				bcrypt.hash(user.password, salt, (err, hash) => {
					user.password = hash;
					user
						.save()
						.then(user => {
							console.log("save here....");
							sendMail(
								`${username}`,
								"USER PASSCODE",
								`This is your password -> ${password}`,
								`<h1>This is your password -> ${password}</h1>`
							)
								.then(res => console.log("sent", res))
								.catch(err => console.log("error", err.message));
							return res.status(200).send(user);
						})
						.catch(err => {
							console.log(err);
							return res
								.status(500)
								.send({ error: "User could not be saved" });
						});
				});
			});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ error: err });
		});
});

Router.get("/", (req, res) => {
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
