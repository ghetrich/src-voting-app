const jwt = require("jsonwebtoken");


// const generateAccessToken = user => {
// return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
// }


module.exports = {
	generateAccessToken: user => {
		return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "1m",
		});
	},
	generateRefreshToken: user => {
		return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: "7d",
		});
	},
};