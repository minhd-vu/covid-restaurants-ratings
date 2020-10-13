// const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;

// ################ EXPRESS SERVER ################

var app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "public/index.html");
});

app.listen(port, () => { console.log(`Server running on http://localhost:${port}/`); });

// ############## NODE.JS WEBSERVER ###############

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
// });

// server.listen(port, () => { console.log(`Server running on http://localhost:${port}/`); });

// ################ MYSQL DATABASE ################

var mysql = require('mysql');

var db = mysql.createConnection({
  host: "mysqldb",
  user: "root",
  password: "password"
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});