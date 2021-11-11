const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const campusSchema = new Schema({
	name: { type: String, required: true, trim: true },
	location: { type: String, required: true, trim: true },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: new Date() },
});

const Campus = mongoose.model("Campus", campusSchema);
module.exports = Campus;
