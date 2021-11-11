const axios = require("axios");
const moment = require("moment");
const url = process.env.BASE_URL_DEV;
module.exports = {
	loadConfig: async (req, res, next) => {
		try {
			const campuses = await axios.get(`${url}/campus`);
			const levels = await axios.get(`${url}/level`);

			const progress = (level, levels) => {

				const levelValues = levels.map(level => level.value)
				const totalOfLevels = levelValues.reduce(
					(total, level) => total + level
				);

				return ((level / totalOfLevels) * 100).toFixed(1) + "%";
			};

			console.log(levels.data);

			res.render("../views/pages/config.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				campuses: campuses.data,
				levels: levels.data,
				BASE_URL: url,
				new_route: "#",
				modal_target: "#modal_new_campus",
				new_button_text: "Add new Campus",
				no_result_message:
					"//Try adjusting your search or filter to find what you're looking for.",
				moment,
				progress,
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
