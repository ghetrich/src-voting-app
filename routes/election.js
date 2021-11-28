const express = require("express");
const Position = require("../models/position");
const Election = require("../models/election");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const sendMail = require("../mailService");
const { uploadBanner } = require("../middleware/upload");

const app = express();
app.post("/new", uploadBanner.single("banner"), (req, res) => {
	const { header, about, startsAt, endsAt, positions } = req.body;

	let banner;

	if (!header || !about || !startsAt || !endsAt) {
		return res.status(400).send({ error: "Bad Request" });
	}

	// if (isGeneral == "false" || (isGeneral == false && !allowedVoters)) {
	// 	return res.status(400).send({
	// 		error: "If this election is not a general election, please provide paticipants",
	// 	});
	// }

	if (req.file) {
		banner = req.file.path.replace(/\\/g, "/");
	} else {
		return res.status(400).send({
			error: "No Banner provided",
		});
	}

	const newElection = new Election({
		header,
		about,
		startsAt,
		endsAt,
		banner,
		positions,
		createdBy: req.user._id,
	});

	newElection
		.save()
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send(err);
		});
});

app.get("/", (req, res) => {
	Election.find({})
		.populate("positions")
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

app.get("/recent", (req, res) => {
	console.log("hit");
	Election.find({})
		.populate({
			path: "positions",
			populate: { path: "candidates.candidate" },
		})
		.populate(["createdBy"])
		.sort({ createdAt: "DESC" })
		.limit(4)
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

app.get("/ongoing", (req, res) => {
	console.log("hit");
	Election.find({})
		.sort({ createdAt: "DESC" })
		.populate({
			path: "positions",
			populate: { path: "candidates.candidate" },
		})
		.populate({
			path: "positions",
			populate: { path: "allowedVoterGroups" },
		})
		.populate(["createdBy", "candidatesList"])
		.then(result => {
			const ongoing = result.filter(
				election =>
					new Date(election.endsAt) > new Date() &&
					new Date(election.startsAt) < new Date() &&
					!election.isForcedClose
			);
			console.log({ result, ongoing });

			return res.status(200).send(ongoing);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

app.get("/pending", (req, res) => {
	console.log("hit");
	Election.find({})
		.populate({
			path: "positions",
			populate: { path: "candidates.candidate" },
		})
		.populate(["createdBy"])
		.then(result => {
			const pending = result.filter(
				election => new Date(election.startsAt) > new Date()
			);
			console.log({ result, pending });

			return res.status(200).send(pending);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

app.get("/closed", (req, res) => {
	console.log("hit");
	Election.find({})
		.sort({ endsAt: "DESC" })
		.populate({
			path: "positions",
			populate: { path: "candidates.candidate" },
		})
		.populate({
			path: "positions",
			populate: { path: "allowedVoterGroups" },
		})
		.populate(["createdBy", "candidatesList"])
		.then(result => {
			const closed = result.filter(
				election =>
					new Date(election.endsAt) < new Date() || election.isForcedClose
			);
			console.log({ result, closed });

			return res.status(200).send(closed);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

app.get("/released", (req, res) => {
	console.log("hit");
	Election.find({isPublished:true})
		.sort({ endsAt: "DESC" })
		.populate({
			path: "positions",
			populate: { path: "candidates.candidate" },
		})
		.populate({
			path: "positions",
			populate: { path: "allowedVoterGroups" },
		})
		.populate(["createdBy", "candidatesList"])
		.then(result => {
			const closed = result.filter(
				election =>
					new Date(election.endsAt) < new Date() || election.isForcedClose
			);
			console.log({ result, closed });

			return res.status(200).send(closed);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

app.get("/:electionId", (req, res) => {
	const electionId = req.params.electionId;
	Election.findById(electionId)
		.populate({
			path: "positions",
			populate: { path: "candidates.candidate" },
		})
		.populate(["createdBy"])
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

app.put("/position/new/:electionId", (req, res) => {
	const electionId = req.params.electionId;
	const { position, about } = req.body;

	if (!position || !about) {
		return res.status(404).send({
			error: "Position cannot be created. Please provide all information",
		});
	}

	const newPosition = new Position({
		position,
		about,
		election: electionId,
	});

	newPosition
		.save()
		.then(position => {
			Election.findByIdAndUpdate(electionId, {
				$push: { positions: position._id },
			})
				.then(done => {
					return res.status(200).send({ done, position });
				})
				.catch(error => {
					console.log(error);
					Position.findByIdAndDelete(position._id).then(done => done);
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send(err);
		});
});

app.put("/:electionId/position/:positionId/candidate/new", (req, res) => {
	const positionId = req.params.positionId;
	const electionId = req.params.electionId;
	const { candidate, about, campus } = req.body;

	if (!candidate || !about || !campus) {
		return res.status(400).send({ error: "Bad Request" });
	}

	Election.findById(electionId)
		.then(election => {
			if (new Date(election.startsAt) < new Date(Date.now())) {
				return res
					.status(400)
					.send({ error: "Cannont add candidate during election" });
			}

			const newCandidate = {
				candidate,
				about,
				campus,
			};

			Position.findByIdAndUpdate(positionId, {
				$push: { candidates: newCandidate },
			})
				.then(done => {
					return res.status(200).send(done);
				})
				.catch(err => {
					console.log(err);
					return res.status(500).send({
						error: err,
					});
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ error: "Something happend" });
		});
});

app.put("/:electionId/position/:positionId/vote/:candidateId", (req, res) => {
	const electionId = req.params.electionId;
	const positionId = req.params.positionId;
	const candidateId = req.params.candidateId;

	Election.findById(electionId)
		.then(election => {
			// if (
			// 	new Date(election.startsAt) > new Date() &&
			// 	new Date(election.endssAt) < new Date()
			// ) {
			// 	return res.status(400).send({ error: "Election is closed" });
			// }

			Position.updateOne(
				{ _id: positionId, "candidates._id": candidateId },
				{ $inc: { "candidates.$.voteCount": 1 } }
			)
				.then(done => {
					return res.status(200).send(done);
				})
				.catch(err => {
					console.log(err);
					return res.status(406).send({
						error: err,
					});
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ error: "Something happend" });
		});
});

module.exports = app;
