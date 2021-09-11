const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
	surname: { type: String, required: true, trim: true },
	othernames: { type: String, required: true, trim: true },
	username: { type: String, required: true, trim: true, unique: true },
	password: { type: String, required: true, trim: true },
	image: { type: String },
	role: {
		type: String,
		
		trim: true,
		enum: ["admin", "candidate", "observer"],
	},
	createdAt: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema)

module.exports = User