const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config()


app.use(express.json())


app.get("/", function (req, res) {
	res.send("Hello World!");
});

app.listen( process.env.PORT || 3030, () => {
   console.log("Example app listening on port 3030!");   
})