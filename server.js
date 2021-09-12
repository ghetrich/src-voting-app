const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");

require("dotenv").config();

app.use(express.json());
app.use("/register", require("./routes/register"));


app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
mongoose
	.connect(
		
			"mongodb+srv://ghet:IT128411@cluster0.ayjeb.mongodb.net/gctu-src-voting-app?retryWrites=true&w=majority",
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


	

