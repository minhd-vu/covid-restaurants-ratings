const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.env.PORT || 3000;

const jsonParser = bodyParser.json();

// ################ MYSQL DATABASE ################

const db = mysql.createConnection({
  host: "mysqldb",
  user: "root",
  password: "password",
  database: "db"
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// ################ EXPRESS SERVER ################

const app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get("/login", function (request, response) {
  response.sendFile(__dirname + "/public/login.html");
});

app.get("/register", function (request, response) {
  response.sendFile(__dirname + "/public/register.html");
});

app.post('/register-new-user', jsonParser, function (request, response) {
  // Create the users table if it does not exist.
  db.query('CREATE TABLE IF NOT EXISTS users (user text, password text)', function (err, result) {
    if (err) throw err;
    console.log("Table users created.");
  });

  // Insert the username and password into the table.
  db.query('INSERT INTO users (user, password) VALUES ("' + request.body.user + '","' + request.body.password + '")', function(err, result) {
    if (err) throw err;
    console.log("Inserted new user into database.");
  });
});

app.listen(port, () => { console.log(`Server running on http://localhost:${port}/`); });

// ############## NODE.JS WEBSERVER ###############

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
// });

// server.listen(port, () => { console.log(`Server running on http://localhost:${port}/`); });