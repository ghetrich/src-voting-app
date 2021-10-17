const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const electionSchema = new Schema({
	header: { type: String, required: true, trim: true },
	about: { type: String, required: true, trim: true },
	banner: { type: String, required: true, trim: true },
	positions:[{type:mongoose.Schema.Types.ObjectId, ref:"Position"}],
	isGeneral: { type: Boolean, default: true },
	allowedVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Register" }],
	startsAt: { type: Date, default: Date.now() },
	endsAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
