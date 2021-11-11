const axios = require("axios");
const ROLES = require("../../../roles");
const moment = require("moment");
const { time_assembler, time_options } = require("../../../utilities/timegen");
const { trunc } = require("../../../utilities/trunc");
const url = process.env.BASE_URL_DEV;
module.exports = {
	loadElections: async (req, res, next) => {
		try {
			const elections = await axios.get(`${url}/elections`);
			console.log(elections.data);
			res.render("../views/pages/elections.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				elections: elections.data,
				roles: ROLES.ROLES,
				BASE_URL: url,
				new_route: "/route/elections/new",
				new_button_text: "Setup new election",
				modal_target:"",
				no_result_message:
					"//Try adjusting your search or filter to find what you're looking for.",
				moment,
				trunc,
			});
		} catch (error) {
			console.log(error);
		}
	},
	createElection: (req, res, next) => {
		res.render("../views/pages/newElection.ejs", {
			layout: "./Layouts/layout",
			user: req.user,
			BASE_URL: url,
		});
	},

	viewElection: async (req, res, next) => {
		const electionId = req.params.electionId;
		try {
			const election = await axios.get(`${url}/elections/${electionId}`);
			
		
			res.render("../views/pages/singleElection.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				BASE_URL: url,
				election: election.data,
				
				new_route: "/route/elections/new",
				new_button_text: "Setup new election",
				no_result_message:
					"//Try adjusting your search or filter to find what you're looking for.",
				moment,
			});
		} catch (err) {
			console.log(err);
		}
	},
	createPosition: async (req, res, next) => {
	const electionId = req.params.electionId;
		try {
			const election = await axios.get(`${url}/elections/${electionId}`);
			const candidates = await axios.get(`${url}/user/candidates`);
			const groups = await axios.get(`${url}/group`);
				console.log(groups.data);
			res.render("../views/pages/newPosition.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				election: election.data,
				candidates: candidates.data,
				groups: groups.data,
				BASE_URL: url,
				moment
			});
		} catch (error) {
			console.log(error);
		}
		
	},
};
