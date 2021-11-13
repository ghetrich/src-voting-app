const express = require("express");
const Position = require("../models/position");
const Election = require("../models/election");

const app = express();
app.post("/new/:electionId", async (req, res) => {
	const electionId = req.params.electionId;

	console.log(req.body);

	const { position, about, candidates, isGeneral, allowedVoterGroups } =
		req.body;

	if (!position || !about || candidates.length < 1) {
		return res.send({ error: "Please provide all required information" });
	}

	// check whether the position is opened to all and if not make sure that allow group of voters are provided

	if (!isGeneral && allowedVoterGroups.length < 1) {
		return res.send({
			error: "Please indicate those allowed to vote for this position",
		});
	}

	// check if election has started
	Election.findById(electionId)
		.then(election => {
			if (new Date(election.startsAt) < new Date()) {
				return res.send({ error: "Election has already started" });
			} else {
				const cand = candidates.map(candidate => {
					return { candidate };
				});

				const newPosition = new Position({
					election: electionId,
					position,
					about,
					candidates: cand,
					isGeneral,
					allowedVoterGroups,
					createdBy: req.user._id,
				});

				newPosition
					.save()
					.then(position => {
						console.log(position);

						Election.findByIdAndUpdate(electionId, {
							$push: {
								positions: position._id,
								candidatesList: candidates,
							},
						})
							.then(done => {
								return res.status(200).send(done);
							})
							.catch(error => {
								console.log(error);
								return res.status(500).send({
									error: "Something went wrong saving position",
								});
							});
					})
					.catch(error => {
						console.log(error);
						return res
							.status(500)
							.send({ error: "Something went wrong saving position" });
					});
			}
		})
		.catch(error => {
			console.log(error);
			return res.status(500).send({ error: "cannot find election" });
		});
});

app.get('/', async (req, res) => {


	
})

module.exports = app;
