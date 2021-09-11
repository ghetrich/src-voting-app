const jwt = require("jsonwebtoken");

const restrictedTo = roles => (req, res, next) => {
	const token = req.header("x-auth-token");

	try {
		if (!token) {
			return res.status(401).json("No token, authorization denied");
		} else {
			const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.user = decoded;
			!roles.some(r => req.user.role.includes(r))
				? res.status(401).json({ msg: "Unauthorized" })
				: next();
		}
	} catch (error) {
		res.status(400).json("Token is not valid");
	}
};

module.exports = restrictedTo;
