const axios = require("axios");
const moment = require("moment");
const { trunc } = require("../../../utilities/trunc");
const { votePercentage } = require("../../../utilities/votePercentage");
const { widthValue, totalVoteCast } = require("../../../utilities/progress");

const url = process.env.BASE_URL;
const domain = process.env.DOMAIN


module.exports = {
	loadOngoingElections: async (req, res, next) => {
		try {
			const ongoingElections = await axios.get(`${url}/elections/ongoing`);
			const closedElections = await axios.get(`${url}/elections/closed`);
			const register = await axios.get(`${url}/register/total`);
			// const levels = await axios.get(`${url}/level`);

			

			console.log(closedElections.data);

			res.render("../views/pages/index.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				ongoingElections: ongoingElections.data,
				closedElections: closedElections.data,
				register: register.data,
				trunc,
				BASE_URL: url,
				new_route: "#",
				modal_target: "#modal_new_campus",
				new_button_text: "Add new Campus",
				no_result_message:
					"//Try adjusting your search or filter to find what you're looking for.",
				moment,
				domain,
				widthValue,
				totalVoteCast,
				votePercentage,
			});
		} catch (error) {
			console.log(error);
		}
	},
	
};
