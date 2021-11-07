const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	surname: { type: String, required: true, trim: true },
	othernames: { type: String, required: true, trim: true },
	username: { type: String, required: true, trim: true, unique: true },
	password: { type: String, required: true, trim: true },
	phone: { type: String, required: true, trim: true },
	about: { type: String, required: true, trim: true },
	campus: { type: String, required: true, trim: true },
	tokenVersion: { type: Number, default: 0 },
	image: { type: String },
	role: {
		type: String,

		trim: true,
		enum: ["Admin", "Candidate", "Observer"],
	},
	createdAt: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
