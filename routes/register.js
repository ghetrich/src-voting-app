const Router = require("express").Router();
const Register = require("../models/register");


const { uploadProfile } = require("../middleware/upload");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const restrictedTo = require("../middleware/restricted");
const authenticate = require("../middleware/auth");
// restrictedTo(["admin"]);

Router.post("/new", uploadProfile.single("image"), (req, res) => {
	console.log(req.body);
	let image = "uploads/images/1.jpg";
	const { othernames, surname, email, level, campus, index, groups } = req.body;

	if ((!othernames || !surname || !email, !level || !campus || !index)) {
		return res.status(404).send("Empty field detected!");
	}

	if (req.file) {
		image = req.file.path.replace(/\\/g, "/");
		console.log(req.file);
	}

	Register.find({ email })
		.then(voterExist => {
			if (voterExist.length > 0) {
				return res.status(402).send({ error: "Voter already exists" });
			}

			const newRegister = new Register({
				othernames,
				surname,
				email,
				level,
				groups,
				campus,
				image,
				index,
			});

			newRegister
				.save()
				.then(result => {
					console.log(result);
					return res.status(200).send(result);
				})
				.catch(err => {
					console.log(err);
					return res.status(500).send(err);
				});
		})
		.catch(err => {
			console.log(err);
		});

	

	
});

Router.get("/", (req, res) => {
	Register.find({})
		.populate(["level","campus"])
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

Router.get("/total", (req, res) => {

	Register.find({ eligibility: true })
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});


Router.get("/:voterId", (req, res) => {
	const voterId = req.params.voterId;
	Register.findById(voterId)
		.populate(["level", "campus"])
		.then(result => {
			return res.status(200).send(result);
		})
		.catch(err => {
			return res.status(500).send(err);
		});
});

module.exports = Router;
