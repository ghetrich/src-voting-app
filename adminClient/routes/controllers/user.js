const axios = require("axios");
const url = process.env.BASE_URL_PRO;
module.exports = {
    
    loadUsers: async (req, res, next) => {
        
		try {
			const users = await axios.get(`${url}/user`);
		
			res.render("../views/pages/users.ejs", {
				layout: "./Layouts/layout",
				user: req.user,
				users: users.data,
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
