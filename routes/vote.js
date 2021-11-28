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

	console.log(email);

	if (!email) {
		return res.status(400).send({ status:400, error: "missing email" });
	}

	Register.find({ email })
		.then(voter => {
			
			if (voter.length < 1) {
				return res
					.status(402)
					.send({ status: 402, error: "email not found" });
			} else if (voter[0].eligibility == false) {
				return res.status(402).send({ status: 402, error: "You are not eligible" });
			} else {

				const tokens = voter[0].tokens.map(token => token.election);
				
				if (tokens.includes(electionId)) {
					return res
						.status(402)
						.send({ status: 402, error: `Token has already been sent to ${email}` });
				} else {
					const voteCode = nanoid(6).toUpperCase();

					Election.findById(electionId)
						.then(election => {
							if (new Date(election.endsAt) < new Date()) {
								return res
									.status(400)
									.send({ status: 400, error: "Sorry the election has ended" });
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

									return res.status(200).send({ status: 200, msg:`Token has been sent successfully to ${email}` });
								})
								.catch(error => {
									console.log(error);
									return res
										.status(500)
										.send({
											status: 500,
											error: "Could not send token",
										});
								});
						})
						.catch(error => {
							console.log(error);
							return res
								.status(500)
								.send({
									status: 500,
									error: `Something went wrong with the server => ${error}`,
								});
						});
				}

				
			}
		})
		.catch(error => {
			return res
				.status(500)
				.send({
					status: 500,
					error: `Something went wrong with the server => ${error}`,
				});
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

	console.log({ candidate, voter, voteToken, electionId, positionId});

	Election.findById(electionId)
		.then(election => {
			if (
				new Date(election.startsAt) > new Date() ||
				new Date(election.endsAt) < new Date() ||
				election.isForcedClose == true
			) {
				console.log("You cannot cast vote");
				return res
					.status(403)
					.send({ status: 400, error: "You cannot cast vote" });
			}

			// check whether the voter is eligible to vote
			Register.find({ email:voter})
				.then(voter => {
					if (voter.length < 1) {
						console.log("Voter cannot be found in the register");
						return res
							.status(400)
							.send({
								status: 400,
								error: "Voter cannot be found in the register",
							});
					}
					else if (!voter[0].eligibility) {
						console.log("You cannot cast vote! You're not eligible");
						return res
							.status(403)
							.send({
								status: 400,
								error: "You cannot cast vote! You're not eligible",
							});
					} else if (
						!voter[0].tokens.some(token => {
							if (
								token.election == electionId &&
								new Date(token.voteCodeExpiresAt) > new Date() &&
								token.voteCode == voteToken
							) {
								return true;
							}
						})
					) {
							console.log("You cannot cast vote! token invalid");
						return res
							.status(403)
							.send({
								status: 400,
								error: "You cannot cast vote! token invalid",
							});
					} else {
						Position.findById(positionId)
							.then(position => {
								
								if (position.voters.includes(voter[0]._id)) {
									return res
										.status(201)
										.send({
											status: 400,
											error: "You've already voted",
										});
								} else if (
									position.allowedVoterGroups.some(group =>
										voter[0].groups.includes(group)
									) ||
									position.isGeneral == true
								) {
									Position.updateOne(
										{ _id: positionId, "candidates._id": candidate },
										{
											$inc: { "candidates.$.voteCount": 1 },

											$push: {
												voters: voter[0]._id,
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
												console.log(vote);
                                            return res
																.status(200)
																.send({ status: 200, msg:"Your vote was successfully"  });
										})
										.catch(error => {
											console.log(error);
											return res.status(403).send({
												status: 500,
												error: "Something went wrong with your vote cast",
											});
										});
								} else {
									console.log(
										"You cannot cast vote! You do not qualify to cast vote for this position"
									);
									return res
										.status(403)
										.send({
											status: 500,
											error: "You cannot cast vote! You do not qualify to cast vote for this position",
										});
								}
							})
							.catch(error => {
								console.log(error);
								return res.status(403).send({
									status: 500,
									error: "Something went wrong - > " + error,
								});
							});
					}
				})
				.catch(err => {
					console.log(err);
					return res.status(403).send({
						status: 500,
						error: "Something went wrong - > " + error,
					});
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(403).send({
				status: 500,
				error: "Something went wrong - > " + error,
			});
		});
});

module.exports = app;
