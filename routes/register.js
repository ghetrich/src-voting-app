const Router = require("express").Router();
const Register = require("../models/register");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
	"643697278581-3s6j9dgshns4t8b1b5bf0ov81ggm0cum.apps.googleusercontent.com";
const CLIENT_SECRET = "f3wHOsC8qvyx40NbZEyNOM6n";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
	"1//042SDWeqKZldcCgYIARAAGAQSNwF-L9IrQ7G7YfQT02ZQiC8ATcnrk3IT5EyLNpbO_flfDff7bzKAOJUQ12mOqv882j7_Lhezca8";

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (to, subject, text, html) => {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "ghetrich370@gmail.com",
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: "GCTU SRC <ghetrich370@gmail.com>",
			to,
			subject,
			text,
			html,
		};

		const result = await transport.sendMail(mailOptions);

		return result;
	} catch (error) {
		return error;
	}
};

Router.post("/", (req, res) => {
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

Router.get("/", (req, res) => {
	Register.find({})
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

module.exports = Router;
