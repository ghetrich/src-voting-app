const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const MongoStore = require("connect-mongo")(session);
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");

require("dotenv").config();
require("./config/passport")(passport);

app.use(express.json());
app.use(cookieParser("secret"));

app.use(
	session({
		secret: "keyboard",
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/register", require("./routes/register"));


app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
mongoose
	.connect(
		"mongodb+srv://ghet:IT128411@cluster0.ayjeb.mongodb.net/gctu-src-voting-app?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			
		}
	)
	.then(result => {
		console.log("connected to DB");
		app.listen(process.env.PORT || 3030, () => {
			console.log("GCTU SRC Voting App listening on port 3030!");
		});
	});

app.get('/', (req, res) => {
	
	req.flash("info", "Welcome");
	return res.send("LOGIN PAGE")

	
})

app.get("/dashboard", (req, res) => {
	return res.send("DASHBOARD PAGE");
});


	

