const Router = require("express").Router();
const Register = require("../models/register");
const nanoid = require("nanoid") ;

Router.post("/", (req, res) => {
	const { othernames, surname, email, eligibility, campus, index } =
		req.body;

	if (
		(!othernames || !surname || !email,
		!eligibility || !campus || !index)
	) {
		return res.status(404).send("Empty field detected!");
	}

	const newRegister = new Register({
		othernames,
		surname,
		email,
		eligibility,
		voteCode: nanoid(7),
		campus,
		index,
	});

	newRegister
		.save()
		.then(result => {
			return res.status(200).send(result);
		})
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
            
		});
});

module.exports = Router;
