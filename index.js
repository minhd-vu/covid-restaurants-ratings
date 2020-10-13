// const http = require('http');
const express = require('express');
const port = process.env.PORT || 3000;

// ################ EXPRESS SERVER ################

var app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

// You technically don't need this.

// app.get("/login", function (request, response) {
//   response.sendFile(__dirname + "/public/login.html");
// });

app.listen(port, () => { console.log(`Server running on http://localhost:${port}/`); });

// ############## NODE.JS WEBSERVER ###############

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
// });

// server.listen(port, () => { console.log(`Server running on http://localhost:${port}/`); });

// ################ MYSQL DATABASE ################

var mysql = require('mysql');

var mysqldb = mysql.createConnection({
  host: "mysqldb",
  user: "root",
  password: "password"
});

mysqldb.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});