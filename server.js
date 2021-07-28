const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config()


app.use(express.json())


app.get("/", function (req, res) {
    res.send({
			name: "api",
			version: "1.0.0",
			description: "Tawiah SRC App",
			main: "server.js",
			scripts: {
				test: 'echo "Error: no test specified" && exit 1',
			},
			keywords: ["Voting", "App"],
			author: "rBOUARO",
			license: "ISC",
			dependencies: {
				cors: "^2.8.5",
				dotenv: "^10.0.0",
				express: "^4.17.1",
				gitignore: "^0.7.0",
				nodemon: "^2.0.12",
			},
		});
});

app.listen( process.env.PORT || 3030, () => {
   console.log("Example app listening on port 3030!");   
})