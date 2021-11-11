const Router = require("express").Router();
const Register = require("../models/register");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const { uploadProfile } = require("../middleware/upload");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const sendMail = require("../mailService");
const restrictedTo = require("../middleware/restricted");
const authenticate = require("../middleware/auth");
// restrictedTo(["admin"]);

Router.post("/new", uploadProfile.single("image"), (req, res) => {
	console.log(req.body);
	let image = "uploads/images/1.jpg";
	const { othernames, surname, email, level, campus, index, groups } = req.body;

	if ((!othernames || !surname || !email, !level || !campus || !index)) {
		return res.status(404).send("Empty field detected!");
	}

	if (req.file) {
		image = req.file.path;
		console.log(req.file);
	}

	Register.find({ email })
		.then(voterExist => {
			if (voterExist.length > 0) {
				return res.status(402).send({ error: "Voter already exists" });
			}

			const newRegister = new Register({
				othernames,
				surname,
				email,
				level,
				groups,
				campus,
				image,
				index,
			});

			newRegister
				.save()
				.then(result => {
					console.log(result);
					return res.status(200).send(result);
				})
				.catch(err => {
					console.log(err);
					return res.status(500).send(err);
				});
		})
		.catch(err => {
			console.log(err);
		});

	// let code = nanoid(7).toUpperCase();
	// sendMail(
	// 	"richardbouaro.a@gmail.com",
	// 	"VOTE PERMISSION CODE",
	// 	`This is your permission code -> ${code}`,
	// 	`<h1>This is your permission code -> ${code}</h1>`
	// )
	// 	.then(res => console.log("sent", res))
	// 	.catch(err => console.log("error", err.message));

	
});

Router.get("/", (req, res) => {
	Register.find({})
		.populate(["level","campus"])
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});


Router.get("/:voterId", (req, res) => {
	const voterId = req.params.voterId;
	Register.findById(voterId)
		.populate(["level", "campus"])
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

module.exports = Router;
