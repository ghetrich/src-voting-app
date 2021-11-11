const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupSchema = new Schema({
	name: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
