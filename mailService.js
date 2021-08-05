const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config({
    path: `${__dirname}/.env`
});

const oAuth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URL
);
const REFRESH_TOKEN = '1//042SDWeqKZldcCgYIARAAGAQSNwF-L9IrQ7G7YfQT02ZQiC8ATcnrk3IT5EyLNpbO_flfDff7bzKAOJUQ12mOqv882j7_Lhezca8'
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (to, subject, text, html) => {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "ghetrich370@gmail.com",
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: "GCTU SRC GO MOBILE <ghetrich370@gmail.com>",
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


module.exports = sendMail;