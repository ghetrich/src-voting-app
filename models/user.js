const mongoose = require("mongoose");

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    othernames: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true, enum: ['admin', 'candidate', 'observer'] },
    createdAt:{ type: Date, default: Date.now()}
})

const User = mongoose.model("User", userSchema)

module.exports = User