const nodemailer = require("nodemailer");
const { google } = require("googleapis");

require("dotenv").config();

// const oAuth2Client = new google.auth.OAuth2(
// 	process.env.CLIENT_ID,
// 	process.env.CLIENT_SECRET,
// 	process.env.REDIRECT_URL
// );
// oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendMail = async (to, subject, text, html) => {
	try {
		// const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "hotmail",
			auth: {
				// type: "OAuth2",
				user: "srcgomobile@outlook.com",
				pass: "@Out@Look@1000",
				// clientId: process.env.CLIENT_ID,
				// clientSecret: process.env.CLIENT_SECRET,
				// refreshToken: process.env.REFRESH_TOKEN,
				// accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: "GCTU SRC GO MOBILE <srcgomobile@outlook.com>",
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