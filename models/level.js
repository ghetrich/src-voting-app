const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const levelSchema = new Schema({
	name: { type: String, required: true, trim: true },
	value: { type: Number, required: true, trim: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Level = mongoose.model("Level", levelSchema);
module.exports = Level;
