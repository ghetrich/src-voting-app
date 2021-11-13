const express = require("express");
const Register = require("../models/register");
const Election = require("../models/election");
const Position = require("../models/position");
const sendMail = require("../mailService");
// const nodemailer = require("nodemailer");
const { messageHTML } = require("../mailTemplate");
const { nanoid } = require("nanoid");

const app = express();

app.put("/token/:electionId", async (req, res) => {
	const electionId = req.params.electionId;
	const { email } = req.body;

	if (!email) {
		return res.status(400).send({ error: "missing email" });
	}

	Register.find({ email })
		.then(voter => {
			if (voter.length < 0) {
				return res.status(402).send({ error: "email not found" });
			} else if (voter[0].eligibility == false) {
				return res.status(402).send({ error: "not eligible" });
			} else {
				const voteCode = nanoid(6).toUpperCase();

				Election.findById(electionId)
					.then(election => {
						if (new Date(election.endsAt) < new Date()) {
							return res
								.status(403)
								.send({ error: "election has ended" });
						}

						console.log(voter[0]);
						Register.findByIdAndUpdate(voter[0]._id, {
							$set: {
								voteCode,
								voteCodeExpiresAt: new Date(election.endsAt),
							},
						})
							.then(done => {
								console.log(done);
								sendMail(
									`${email}`,
									"VOTE PERMISSION CODE",
									`This is your permission code -> ${voteCode}`,
									messageHTML(voteCode)
								)
									.then(res => console.log("sent", res))
									.catch(err => console.log("error", err.message));

								return res.status(200).send(done);
							})
							.catch(error => {
								console.log(error);
								return res
									.status(500)
									.send({ error: "Could not send token" });
							});
					})
					.catch(error => {
						console.log(error);
						return res
							.status(500)
							.send({ error: "Something went wrong" });
					});
			}
		})
		.catch(error => {
			return res.status(500).send({ error: "Something went wrong" });
		});
});

app.put("/cast/positionId/electionId", async (req, res) => {
	const positionId = req.params.positionId;
	const electionId = req.params.electionId;
	const { candidate, voter } = req.body;

	Election.findById(electionId).then(election => {
		if (
			new Date(election.startsAt) > new Date() ||
			new Date(election.endsAt) < new Date() ||
			election.isForcedClose == true
		) {
			return res.status(403).send({ error: "You cannot cast vote" });
		}

		
		
	});
});

module.exports = app;
