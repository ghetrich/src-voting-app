const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const positionSchema = new Schema({
	election: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
	position: { type: String, required: true, trim: true },
	isGeneral: { type: Boolean, default: true },
	allowedVoterGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
	about: { type: String, required: true, trim: true },
	voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Register" }],
	candidates: [
		{
			candidate: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			// about: { type: String, required: true, trim: true },
			// campus: { type: String, required: true, trim: true },
			voteCount: {
				type: Number,
				trim: true,
				default: 0,
			},
		},
	],
	isPublished: { type: Boolean, default: false },
	publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;
