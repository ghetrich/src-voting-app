const Router = require("express").Router();
const Register = require("../models/register");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const sendMail = require("../mailService");
const restrictedTo = require("../middleware/restricted")
const authenticate = require("../middleware/auth")


Router.post("/new", restrictedTo(["admin"]), (req, res) => {
	const { othernames, surname, email, eligibility, campus, index } = req.body;

	if ((!othernames || !surname || !email, !eligibility || !campus || !index)) {
		return res.status(404).send("Empty field detected!");
	}
	let code = nanoid(7).toUpperCase();
	const newRegister = new Register({
		othernames,
		surname,
		email,
		eligibility,
		voteCode: code,
		campus,
		index,
	});

	newRegister
		.save()
		.then(result => {
			sendMail(
				"richardbouaro.a@gmail.com",
				"VOTE PERMISSION CODE",
				`This is your permission code -> ${code}`,
				`<h1>This is your permission code -> ${code}</h1>`
			)
				.then(res => console.log("sent", res))
				.catch(err => console.log("error", err.message));
			return res.status(200).send(result);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send(err);
		});
});

Router.get("/", ensureAuth, (req, res) => {
	Register.find({})
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

module.exports = Router;
