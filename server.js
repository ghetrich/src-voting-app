const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
require("dotenv").config();

app.use(express.json());

mongoose
	.connect(
		process.env.DB_URI ||
			"mongodb+srv://ghet:IT128411@cluster0.ayjeb.mongodb.net/gctu-src-voting-app",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(result => {
		console.log("connected to DB");
		app.listen(process.env.PORT || 3030, () => {
			console.log("Example app listening on port 3030!");
		});
	});

app.get('/', (req, res) => {
	return res.send("Welcome! THIS GCTU SRC VOTING APP API")
})

app.use("register", require("./routes/register"))
	

