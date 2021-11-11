const axios = require("axios");
const moment = require("moment");
const url = process.env.BASE_URL_DEV;
module.exports = {
	loadGroups: async (req, res, next) => {
		try {
			const groups = await axios.get(`${url}/group`);
			
			console.log(groups.data);

			res.render("../views/pages/groups.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				groups: groups.data,				
				BASE_URL: url,
				new_route: "#",
				modal_target: "#modal_new_group",
				new_button_text: "Add new voter group",
				no_result_message:
					"//Try adjusting your search or filter to find what you're looking for.",
				moment,
				
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
