const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const express_layout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const { ensureAuth, ensureGuest } = require("./middleware/auth");
const MongoStore = require("connect-mongo")(session);
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path");

require("dotenv").config();
require("./config/passport")(passport);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser("secret"));

app.use(express.static("adminClient"));
app.use("/css", express.static(__dirname + "/adminClient/public/dist/css"));
app.use("/fonts", express.static(__dirname + "/adminClient/public/fonts"));
app.use("/libs", express.static(__dirname + "/adminClient/public/dist/libs"));
app.use("/img", express.static(__dirname + "/adminClient/public/dist/img"));
app.use("/js", express.static(__dirname + "/adminClient/public/dist/js"));
app.use(
	"/static",
	express.static(__dirname + "/adminClient/public/static")
);

app.use("/uploads", express.static("./uploads"));

app.use(express_layout);
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

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
	}).catch((error) => {
		console.error(error);
	})

app.use("/register", require("./routes/register"));

app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));
app.use("/elections", require("./routes/election"));
app.use("/position", require("./routes/position"));
app.use("/register", require("./routes/register"));
app.use("/campus", require("./routes/campus"));
app.use("/level", require("./routes/level"));
app.use("/group", require("./routes/group"));

app.use("/route", require("./adminClient/routes/base"));

app.get("/", ensureGuest, (req, res) => {
	res.render(__dirname + "/views/pages/index.ejs", {
		layout: "./Layouts/layout",
	});
});

app.get("/login", ensureGuest, (req, res) => {
	res.render(__dirname + "/views/pages/login.ejs", {
		layout: "./Layouts/layout",
	});
});


