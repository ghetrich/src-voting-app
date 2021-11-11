const express = require("express");
const Level = require("../models/level");
const app = express();

app.post("/new", async (req, res) => {
	const user = req.user;
	console.log({ user, body: req.body });
	const { name, value } = req.body;

	if (!name || !value) {
		return res.status(401).send({ error: "all fields are required" });
	}

	const newLevel = new Level({ name, value, createdBy: user.id });

	Level.find({ name })
		.then(level => {
			if (level.length > 0) {
				console.log(level);
				return res
					.status(402)
					.send({ error: "Level with this name already exists" });
			}

			newLevel
				.save()
				.then(item => {
					console.log(item);
					return res.status(200).send(item);
				})
				.catch(err => {
					return res.status(500).send({ error: "Error saving campus" });
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				error: "Something went wrong when trying to create level",
			});
		});
});

app.get("/", async (req, res) => {
	Level.find({})
		.then(levels => {
			return res.status(200).send(levels);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				error: "Something went wrong when trying to fetch levels",
			});
		});
});

app.get("/:levelId", async (req, res) => {
	const levelId = req.params.levelId;
	Level.findById(levelId)
		.then(level => {
			return res.status(200).send(level);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				error: "Something went wrong when trying to fetch level",
			});
		});
});

module.exports = app;
