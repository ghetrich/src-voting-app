const express = require('express');
const { ensureAuth, ensureGuest } = require("../../middleware/auth");
const {loadUsers, createUser} = require("./controllers/user")
const { loadElections } = require("./controllers/election");
const app = express();

app.get("/dashboard", ensureAuth, (req, res) => {
	res.render("../views/pages/dashboard.ejs", {
		layout: "./Layouts/layout",
		user: req.user,
	});
});

app.get("/users", ensureAuth, loadUsers);

app.get("/users/new", ensureAuth, createUser);
app.get("/elections/new", ensureAuth, loadElections);


module.exports = app