const express = require("express");
const Register = require("../models/register");
const Election = require("../models/election");
const Position = require("../models/position");
const sendMail = require("../mailService");
const Pusher = require("pusher");
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
							$push: {
								tokens: {
									election: election._id,
									voteCode,
									voteCodeExpiresAt: new Date(election.endsAt),
								},
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

const pusher = new Pusher({
	app_id: "1297143",
	key: "dcbc595cc4a992faed50",
	secret: "d5f8913818767a81a715",
	cluster: "eu",
	useTLS: true,
});

app.get("/", (req, res) => {
	console.log("hit");
	pusher.trigger("gctu-src-election", "gctu-src-vote", {
		vote: 1,
	});
	return res.send({ vote: 1 });
});
app.put("/cast/:positionId/:electionId", async (req, res) => {
	const positionId = req.params.positionId;
	const electionId = req.params.electionId;
	const { candidate, voter, voteToken } = req.body;

	Election.findById(electionId)
		.then(election => {
			if (
				new Date(election.startsAt) > new Date() ||
				new Date(election.endsAt) < new Date() ||
				election.isForcedClose == true
			) {
				return res.status(403).send({ error: "You cannot cast vote" });
			}

			// check whether the voter is eligible to vote
			Register.findById(voter)
				.then(voter => {
					if (!voter.eligibility) {
						return res.status(403).send({
							error: "You cannot cast vote! You're not eligible",
						});
					} else if (
						!voter.tokens.some(token => {
							if (
								token.election == electionId &&
								new Date(token.voteCodeExpiresAt) > new Date() &&
								token.voteCode == voteToken
							) {
								return true;
							}
						})
					) {
						return res.status(403).send({
							error: "You cannot cast vote! token invalid",
						});
					} else {
						Position.findById(positionId)
							.then(position => {
								// console.log({
								// 	allowedVoterGroups: position.allowedVoterGroups,
								// 	groups: voter.groups,
								// 	isGeneral: position.isGeneral,
								// 	qualify: position.allowedVoterGroups.includes(
								// 		voter.groups
								// 	),
								//});
								if (position.voters.includes(voter._id)) {
									return res.status(200).send({
										msg: "You've already voted",
									});
								} else if (
									position.allowedVoterGroups.some(group =>
										voter.groups.includes(group)
									) ||
									position.isGeneral == true
								) {
									Position.updateOne(
										{ _id: positionId, "candidates._id": candidate },
										{
											$inc: { "candidates.$.voteCount": 1 },

											$push: {
												voters: voter._id,
											},
										},
										{ new: true }
									)
										.then(vote => {
											// Position.findById(positionId)
											// 	.then(position => {
											// 		pusher.trigger(
											// 			"gctu-src-election",
											// 			"gctu-src-vote",
											// 			{ currentResult: position }
											// 		);
											// 		return res.status(200).send(position);
											// 	})
											// 	.catch(error => {
											// 		console.log(error);
											// 	});

                                            return res.status(200).send(vote);
										})
										.catch(error => {
											console.log(error);
										});
								} else {
									return res.status(403).send({
										error: "You cannot cast vote! You do not qualify to cast vote for this position",
									});
								}
							})
							.catch(error => {
								console.log(error);
							});
					}
				})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = app;
