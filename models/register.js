const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const registerSchema = new Schema({
	othernames: { type: String, required: true, trim: true },
	surname: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true },
	index: { type: String, required: true, trim: true, unique: true },
	level: { type: mongoose.Schema.Types.ObjectId, ref: "Level" },
	eligibility: { type: Boolean, default: true },
	image: { type: String, required: true, trim: true },
	groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
	campus: { type: mongoose.Schema.Types.ObjectId, ref: "Campus" },
	tokens: [
		{
			election:{},
			voteCode: { type: String, trim: true, default: "UTUH1R" },
			voteCodeExpiresAt: { type: Date, default: new Date() },
		},
	],

	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Register = mongoose.model("Register", registerSchema);
module.exports = Register;
