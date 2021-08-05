const mongoose = require('mongoose');

const Schema = mongoose.Schema

const registerSchema = new Schema({
	othernames: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email:{type: String, required: true, trim: true},
    index: { type: String, required: true, trim: true, unique: true },
    eligibility:{type:Number, required: true, trim: true},
    campus: { type: String, required: true, trim: true },
    voteCode: { type: String, required: true, trim: true },
    createdAt:{type:Date, default: new Date()}
});



const Register = mongoose.model('Register', registerSchema);
module.exports = Register