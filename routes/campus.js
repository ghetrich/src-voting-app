const express = require("express");
const Campus = require("../models/campus");
const app = express();

app.post("/new", async (req, res) => {
    const user = req.user;
    console.log({user, body: req.body});
	const { name, location } = req.body;

	if (!name || !location) {
		return res.status(401).send({ error: "all fields are required" });
	}

	const newCampus = new Campus({ name, location, createdBy: user.id });

	Campus.find({ name })
		.then(campus => {
			if (campus.length > 0) {
				console.log(campus);
				return res
					.status(402)
					.send({ error: "Campus with this name already exists" });
			}

			newCampus
				.save()
				.then(item => {
					console.log(item);
					return res.status(200).send({status:200, msg: "Campus saved successfully"});
				})
				.catch(err => {
					return res
						.status(500)
						.send({ status: 500, error: "Error saving campus" });
				});
		})
		.catch(err => {
			console.log(err);
			return res
				.status(500)
				.send({
					status: 500,
					error: "Something went wrong when trying to create campus",
				});
		});
});

app.get("/", async (req, res) => {
    Campus.find({})
        .sort({createdAt:"DESC"})
		.then(campuses => {
			return res.status(200).send(campuses);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				error: "Something went wrong when trying to fetch campuses",
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
