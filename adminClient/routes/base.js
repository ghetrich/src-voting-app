const express = require("express");
const { ensureAuth, ensureGuest } = require("../../middleware/auth");
const { loadUsers, createUser } = require("./controllers/user");
const { loadVotersRegister } = require("./controllers/register");
const { loadConfig } = require("./controllers/config");
const { loadGroups } = require("./controllers/groups");
const {loadOngoingElections} = require("./controllers/index")
const {
	loadElections,
	createElection,
	viewElection,
	createPosition,
} = require("./controllers/election");
const app = express();

app.get("/dashboard", ensureAuth, (req, res) => {
	res.render("../views/pages/dashboard.ejs", {
		layout: "./Layouts/layout",
		user: req.user,
	});
});

app.get("/users", ensureAuth, loadUsers);

app.get("/users/new", ensureAuth, createUser);
app.get("/elections", ensureAuth, loadElections);
app.get("/elections/new", ensureAuth, createElection);
app.get("/elections/single/:electionId", ensureAuth, viewElection);
app.get("/position/new/:electionId", ensureAuth, createPosition);
app.get("/register", ensureAuth, loadVotersRegister);
app.get("/config", ensureAuth, loadConfig);
app.get("/groups", ensureAuth, loadGroups);
app.get("/vote", ensureGuest, loadOngoingElections);
module.exports = app;
