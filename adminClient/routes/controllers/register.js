const axios = require("axios");
const url = process.env.BASE_URL;
const moment = require("moment");
module.exports = {
	loadVotersRegister: async (req, res, next) => {
		try {
            const votersRegister = await axios.get(`${url}/register`);
            const campuses = await axios.get(`${url}/campus`);
			const levels = await axios.get(`${url}/level`);
			 const groups = await axios.get(`${url}/group`);
            console.log(votersRegister.data);

			res.render("../views/pages/register.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
                register: votersRegister.data,
                campuses: campuses.data,
				levels: levels.data,
				groups: groups.data,
				BASE_URL: url,
				new_route: "#",
				modal_target: "#modal_new_voter",
				new_button_text: "Add new voter",
				no_result_message:
					"//Try adjusting your search or filter to find what you're looking for.",
				moment
			
			});
		} catch (error) {
			console.log(error);
		}
	},
	createVoter: (req, res, next) => {
		res.render("../views/pages/register.ejs", {
			layout: "./Layouts/layout",
			user: req.user,
		});
	},
};
