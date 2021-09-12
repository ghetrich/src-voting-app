const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../middleware/generatetoken");
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
				const accessToken = generateAccessToken(user.toJSON());

				const refreshToken = generateRefreshToken(user.toJSON());

				res.cookie("nin", refreshToken, {
					httpOnly: true,
				});

				return res.status(200).send({ accessToken, refreshToken, user });
				// jwt.sign(
				// 	user.toJSON(),
				// 	process.env.ACCESS_TOKEN_SECRET,
				// 	// { expiresIn: 3600 },
				// 	(err, token) => {
				// 		if (err) throw err;

				// 		return res.send({
				// 			token,
				// 			user,
				// 		});
				// 	}
				// );
			}
		});
	});
};

const updateRefreshTokenVersion = async userId => {
	if (!userId) throw new Error();
	try {
		const incrementToken = await User.findByIdAndUpdate(userId, {
			$inc: { tokenVersion: 1 },
		});

		return true;
	} catch (error) {
		return error;
	}
};

const app = express();

app.use(cookieParser());

app.post("/login", (req, res) => {
	login(req.body, ["admin"], res);
});
app.post("/token", async (req, res) => {
	const token = req.cookies.nin;

	if (!token) {
		return res.send({ Ok: false, accessToken: "" });
	}

	let payload = null;

	try {
		payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
	} catch (error) {
		console.log(error);
		return res.send({ Ok: false, accessToken: "" });
	}

	const user = await User.findById(payload._id);

	if (!user) {
		return res.send({ Ok: false, accessToken: "" });
	}

	if (user.tokenVersion !== payload.tokenVersion) {
		return res.send({ Ok: false, accessToken: "" });
	}

	updateRefreshTokenVersion(payload._id);

	res.cookie("nin", refreshToken, {
		httpOnly: true,
	});

	return res.send({
		Ok: true,
		accessToken: generateAccessToken(user.toJSON()),
	});
});

app.post("/logout", (req, res) => {});

module.exports = app;
