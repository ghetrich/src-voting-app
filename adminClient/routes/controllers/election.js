const axios = require("axios");
const ROLES = require("../../../roles");
const url = process.env.BASE_URL_DEV;
module.exports = {
	loadElections: async (req, res, next) => {
		try {
			const elections = await axios.get(`${url}/elections`);

			res.render("../views/pages/elections.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				elections: elections.data,
				roles: ROLES.ROLES,
				BASE_URL: url,
			});
		} catch (error) {
			console.log(error);
		}
	},
	createUser: (req, res, next) => {
		res.render("../views/pages/newUser.ejs", {
			layout: "./Layouts/layout",
			user: req.user,
		});
	},
};
