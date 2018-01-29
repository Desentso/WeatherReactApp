const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
/*const axios = require("axios");
const async = require("async");*/

const app = express();

app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), () => {
  console.log("Node app is running at localhost:" + app.get('port'))
});

app.use(express.static("public"));
app.use(bodyParser.json());


app.get("/", (req, resp) => {

	resp.sendFile(path.join(__dirname + "/public/index.html"));
});