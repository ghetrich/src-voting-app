const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const electionSchema = new Schema({
	header: { type: String, required: true, trim: true },
	about: { type: String, required: true, trim: true },
	banner: { type: String, required: true, trim: true },
	candidatesList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	positions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Position" }],
	startsAt: { type: Date, default: Date.now() },
	endsAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 },
	isForcedClose: { type: Boolean, default: false },
	forcedClosedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	forcedClosedAt: { type: Date },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
