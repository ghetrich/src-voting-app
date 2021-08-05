const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
require("dotenv").config();

app.use(express.json());

mongoose
	.connect(process.env.DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(result => {
		console.log("connected to DB");
		app.listen(process.env.PORT || 3030, () => {
			console.log("Example app listening on port 3030!");
		});
	})

app.use("register", require("./routes/register"))
	

