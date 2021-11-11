const express = require("express");
const Group = require("../models/groups");
const app = express();

app.post("/new", async (req, res) => {
	const user = req.user;
    const { name, description } = req.body;
    console.log({name, description});

	if (!name || !description) {
		return res.status(404).send({ error: "all fields are required" });
	}

	const newGroup = new Group({ name, description });

	Group.find({ name })
		.then(group => {
			if (group.length > 0) {
				console.log(group);
				return res
					.status(402)
					.send({ error: "Group with this name already exists" });
			}

			newGroup
				.save()
				.then(item => {
					console.log(item);
					return res.status(200).send(item);
				})
				.catch(err => {
					return res.status(500).send({ error: "Error saving group" });
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				error: "Something went wrong when trying to create group",
			});
		});
});

app.get("/", async (req, res) => {
	Group.find({})
		.then(groups => {
			return res.status(200).send(groups);
		})
		.catch(err => {
			console.log(err);
			return res
				.status(500)
				.send({
					error: "Something went wrong when trying to fetch groups",
				});
		});
});

app.get("/:groupId", async (req, res) => {
	const groupId = req.params.groupId;
	Group.findById(groupId)
		.then(group => {
			return res.status(200).send(group);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				error: "Something went wrong when trying to fetch groups",
			});
		});
});

module.exports = app;
