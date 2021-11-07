const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const positionSchema = new Schema({
	election: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
	position: { type: String, required: true, trim: true },
	isGeneral: { type: Boolean, default: true },
	allowedVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Register" }],
	about: { type: String, required: true, trim: true },
	voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Register" }],
	candidates: [
		{
			candidate: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			about: { type: String, required: true, trim: true },
			campus: { type: String, required: true, trim: true },
			voteCount: {
				type: Number,
				required: true,
				trim: true,
				default: 0,
			},
		},
	],

	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;
